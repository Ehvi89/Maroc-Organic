const exceljs = require('exceljs');
const Report = require("../models/Report");
const User = require('../models/User');

exports.getWeeksList = async (req, res, next) => {
    try {
        const weeksListResult = await Report.aggregate([
            {
                $project: {
                    week: { $isoWeek: "$date" },
                    year: { $year: "$date" }
                }
            },
            {
                $group: {
                    _id: { week: "$week", year: "$year" }
                }
            },
            {
                $sort: { "_id.year": -1, "_id.week": -1 }
            }
        ]);

        if (Array.isArray(weeksListResult)) {
            const weeksArray = weeksListResult.map(item => ({
                year: item._id.year,
                week: item._id.week
            }));

            res.status(200).json(weeksArray);
        } else {
            throw new Error("Expected an array from the aggregation query");
        }
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};


exports.getReports = async (req, res, next) => {
    const { week, year } = req.query;

    try {
        let aggregateQuery = [
            {
                $project: {
                    week: { $isoWeek: "$date" },
                    year: { $year: "$date" },
                    report: "$$ROOT"
                }
            },
            {
                $group: {
                    _id: { week: "$week", year: "$year" },
                    reports: { $push: "$report" }
                }
            },
            {
                $sort: { "_id.year": -1, "_id.week": -1 }
            }
        ];

        // Add a $match stage after the $project and $group stages
        if (week !== undefined && year !== undefined) {
            aggregateQuery.push({
                $match: {
                    "_id.week": parseInt(week),
                    "_id.year": parseInt(year)
                }
            });
        }

        const aggregatedResults = await Report.aggregate(aggregateQuery);
        if (!Array.isArray(aggregatedResults)) {
            throw new Error('Expected aggregatedResults to be an array');
        }

        // Handle the case where aggregatedResults is empty
        if (aggregatedResults.length ===  0) {
            res.status(200).json({
                docs: [],
                totalPages:  0,
                hasNextPage: false,
                hasPrevPage: false,
            });
            return;
        }

        // Return all results without pagination
        res.status(200).json({
            docs: aggregatedResults,
            totalPages:  1, // Since there's no pagination, there's only one page
            hasNextPage: false,
            hasPrevPage: false,
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};



// Fonction d'aide pour mettre à jour le champ lastAction du User
const updateUserLastAction = async (userEmail, actionDescription) => {
    const updateFields = {
        $set: {
            lastAction: actionDescription
        }
    };
    // Trouver l'utilisateur par e-mail
    const user = await User.findOne({ email: userEmail });
    if (user) {
        // Mettre à jour le champ lastAction du User trouvé
        await User.findByIdAndUpdate(user._id, updateFields);
    } else {
        console.log('User not found');
    }
};



// Fonction pour ajouter un rapport
exports.addReport = async (req, res, next) => {
    try {
        const report = new Report(req.body);
        const savedReport = await report.save();

        // Mettre à jour le champ lastAction du User
        await updateUserLastAction(req.body.userEmail, `Ajout du rapport sur ${savedReport.client}`);
        res.status(201).json(savedReport);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// Fonction pour mettre à jour un rapport
exports.updateReport = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).send({ message: 'Report ID is required.' });
        }

        const query = { _id: req.params.id };
        const options = { new: true }; // Return the updated document
        const updatedDoc = await Report.findByIdAndUpdate(query, req.body, options);

        if (!updatedDoc) {
            return res.status(404).send({ message: 'Report not found.' });
        }

        // Mettre à jour le champ lastAction du User
        await updateUserLastAction(req.body.userEmail, `Mise à jour du rapport sur ${updatedDoc.client}`);

        res.send(updatedDoc);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error' });
    }
};

// Fonction pour supprimer un rapport
exports.deleteReport = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).send({ message: 'Report ID is required.' });
        }

        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).send({ message: 'Report not found.' });
        }

        await Report.deleteOne({ _id: req.params.id });

        // Mettre à jour le champ lastAction du User
        await updateUserLastAction(req.body.userEmail, `Suppression du rapport sur ${report.client}`);

        res.status(200).json({ message: 'Report deleted!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.export2excel = async (req, res) => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    try {
        // Fetch all reports
        const reports = await Report.find();

        // Group reports by week
        const weeks = {};
        reports.forEach(report => {
            const weekDetails = getWeekDetails(report.date);
            const weekKey = `${weekDetails.year}-${weekDetails.week}`;
            if (!weeks[weekKey]) {
                weeks[weekKey] = [];
            }
            weeks[weekKey].push(report);
        });

        // Create a new workbook
        const workbook = new exceljs.Workbook();

        // Define the columns for the worksheet
        const columns = [
            { header: "DATE", key: "date", width:  15 },
            { header: "JOURS", key: "day", width:  25 },
            { header: "CLIENT", key: "client", width:  25 },
            { header: "CATEGORIE", key: "type", width:  25 },
            { header: "VILLE", key: "city", width:  25 },
            { header: "DEJA CLIENT", key: "alreadyClient", width:  25 },
            { header: "RESPONSABLE", key: "author.name", width:  25 },
            { header: "HEURE DE LA VISITE", key: "hour", width:  25 },
            { header: "DUREE DE LA VISITE", key: "duration", width:  25 },
            { header: "PERSONNE RENCONTREE", key: "person", width:  25 },
            { header: "MARQUES CONCURENTES", key: "competingBrands", width:  25 },
            { header: "NUMERO WHATSAPP", key: "contact.whatsapp", width:  25 },
            { header: "NOM DU CONTACT", key: "contact.name", width:  25 },
            { header: "CONTACT MAROC ORGANIC entré dans le tel du client?", key: "contactMOGiven", width:  25 },
            { header: "CLIENT A FOLLOW SUR INSTAGRAM", key: "clientFollow", width:  25 },
            { header: "COMPTE RENDUE", key: "comment", width:  100 },
        ];

        // Process each week
        Object.entries(weeks).forEach(([weekKey, reports]) => {
            const [year, week] = weekKey.split('-').map(Number);

            // Calculate start and end of the week
            const startOfWeek = new Date(year,  0,  1 + ((week -  1) *  7));
            const endOfWeek = new Date(startOfWeek.getTime());
            endOfWeek.setDate(startOfWeek.getDate() +  4);

            // Format the dates in French with a space as the separator
            const formattedStartDate = startOfWeek.toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'short', year: 'numeric'
            }).replace(/[-/]/g, '.'); // Replace slashes and dashes with spaces

            const formattedEndDate = endOfWeek.toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'short', year: 'numeric'
            }).replace(/[-/]/g, '.'); // Replace slashes and dashes with spaces

            // Create a worksheet for the week
            const worksheet = workbook.addWorksheet(`${formattedStartDate} - ${formattedEndDate}`);


            worksheet.columns = columns;

            // Obtenez la première ligne (ligne d'en-tête)
            const headerRow = worksheet.getRow(1);

            // Ajoutez des styles aux titres de colonnes
            columns.forEach(column => {
                const headerCell = headerRow.getCell(column.key);
                headerCell.font = { bold: true };
                headerCell.alignment = { horizontal: 'center', vertical: 'middle' };
                headerCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '8FB750' }
                };
                headerCell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });

            // Add the reports to the worksheet
            reports.forEach((report, index) => {
                const row = worksheet.addRow({
                    date: report.date,
                    day: days[report.date.getDay()],
                    client: report.client,
                    type: report.type,
                    city: report.city,
                    alreadyClient: report.alreadyClient ? 'Oui' : 'Non',
                    'author.name': report.author.name,
                    hour: report.hour,
                    duration: report.duration,
                    person: report.person,
                    competingBrands: report.competingBrands.map(brand => brand.name).join(', '),
                    'contact.whatsapp': report.contact.whatsapp,
                    'contact.name': report.contact.name,
                    contactMOGiven: report.contactMOGiven ? 'Oui' : 'Non',
                    clientFollow: report.clientFollow ? 'Oui' : 'Non',
                    comment: report.comment
                });

                row.eachCell({ includeEmpty: true },(cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };

                    // Alterner les couleurs de fond des lignes
                    if (index %  2 ===  0) {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFFFFFFF' }
                        };
                    } else {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'F5F4F4' }
                        };
                    }
                });
            });
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Orders.xlsx"
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting data:', error);
        res.status(500).json({ error: error.message });
    }
};

// Helper function to calculate the ISO week number from a date
function getWeekDetails(date) {
    const oneJan = new Date(date.getFullYear(),  0,  1);
    const numDays = Math.floor((date - oneJan) / (24 *  60 *  60 *  1000));
    const weekNum = Math.ceil((numDays + oneJan.getDay() +  1) /  7);
    return {
        week: weekNum,
        year: date.getFullYear()
    };
}


