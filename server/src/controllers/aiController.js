const aiService = require('../services/aiService');

exports.analyzeTask = async (req, res) => {
    try {
        const { taskDescription } = req.body;

        if (!taskDescription) {
            return res.status(400).json({ error: 'Task description is required' });
        }

        const analysis = await aiService.analyzeTask(taskDescription);

        res.json({
            success: true,
            analysis
        });

    } catch (error) {
        console.error('AI Controller Error:', error);
        res.status(500).json({
            error: 'AI analysis failed. Please try again.',
            details: error.message
        });
    }
};