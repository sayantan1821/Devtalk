const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/profile');
const Users = require('../../models/Users');
const {check, validationResult} = require('express-validator');

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user',
        ['name', 'avatar']);

        if(!profile) {
            return res.status(400).json({ mssg: 'No profile founded' });
        }

        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.post('/', [auth, [
    check('status', 'status is required').not().isEmpty(),
    check('skills', 'skills is required').not().isEmpty()
]],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
}
);

module.exports = router;