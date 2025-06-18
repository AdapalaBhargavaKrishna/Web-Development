import User from '../models/User.js';
import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "User Already Exists" })

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashPassword, videos: [] })
        await newUser.save()
        res.status(201).json({ msg: "User Created", user: newUser })
    } catch (err) {
        res.status(500).json({ msg: "Signup Error", error: err.message })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "user Not Found" })

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

        res.status(201).json({ msg: "Login Successful", user })

    } catch (err) {
        res.status(500).json({ msg: "Server Error", error: err.message })
    }
})

router.post('/firebase-login', async (req, res) => {
    try {
        const { name, email } = req.body
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({name, email, password: email})
            await user.save();
             return res.status(201).json({ msg: "User Created", user })
        }
        res.status(201).json({ msg: "Login Successful", user })
    } catch (err) {
        res.status(500).json({ msg: "Server Error", error: err.message })
    }
})

export default router