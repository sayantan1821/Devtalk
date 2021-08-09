const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config')
const auth = require('../../middleware/auth');
const Profile = require('../../models/profile');
const User = require('../../models/User');
const mongoose = require('mongoose');
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
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    // Skills - Spilt into array
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',').map(skill => skill.trim());
    }
    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if(profile) {
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );

            return res.json(profile);
        }

        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
);

// Get all profile
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles);
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
});
//get profile by user id
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar'])

        if (!profile) {
            return res.status(400).json({ msg: 'No profile found' })
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind) {
            return res.status(400).json({ msg: 'Profile not found '})
        }
        res.status(500).send('Server error')
    }
})

// Delete profile, user & post
router.delete('/', auth, async (req, res) => {
    try {
        //remove post

        //remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        //remove user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({msg: 'User Deleted'});
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
});

//Add profile experience
router.put('/experience', [auth,
        [
        check('title', 'Title is required')
            .not()
            .isEmpty(),
        check('company', 'company is required')
            .not()
            .isEmpty(),
        check('from', 'from date is required')
            .not()
            .isEmpty(),
        ]        
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array() });
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }
        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(newExp);
            await profile.save();
            res.json(profile)
        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
)

//Delete experience
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //Get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);    
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

})
//Add profile education
router.put('/education', [auth,
    [
    check('school', 'school is required')
        .not()
        .isEmpty(),
    check('degree', 'degree is required')
        .not()
        .isEmpty(),
    check('fieldofstudy', 'fieldstudy is required')
        .not()
        .isEmpty(),
    check('from', 'from date is required')
        .not()
        .isEmpty(),
    ]        
],
async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile)
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
)

//Delete education
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //Get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);    
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

})

//get Github user repos
router.get('/github/:username',(req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id={config.get(
                'githubClientId
            )}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        }
        request(options, (error, response, body) => {
            if(error) console.error(error);

            if(response.statusCode !== 200) {
                res.status(404).json({ msg: 'No github profile found'})
            }

            res.json(JSON.parse(body));
        })
    } catch (err) {
        console.error(err.message);
    }
})


module.exports = router;