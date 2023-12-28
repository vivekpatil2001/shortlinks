import Link from "./model/Links.js ";
import express, { response } from "express";
import dotenv from 'dotenv';

import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(express.json());



const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    if (conn) {
        console.log(`mongoDB connected Succesfully`)
    }
};

app.post("/link", async (req, res) => {

    const { url, slug } = req.body;



    const randomSlug = Math.random().toString(36).substring(2, 7);

    const link = new Link({
        url: url,
        slug: slug || randomSlug
    })


    try {
        const savedLink = await link.save();

        return res.json({
            success: true,
            data: {
                shortUrl: `${process.env.BASE_URL}/${savedLink.slug}`
            },
            message: "Link saved succesfully"
        })
    }

    catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }

})

app.get("/:slug", async (req, res) => {
    try {
        const { slug } = req.params;

        const link = await Link.findOne({ slug: slug });

        await link.updateOne({ slug: slug }, {
            $set: {
                clicks: link.clicks + 1
            }
        })

        if (!link) {
            return response.json({
                success: false,
                message: "link not found"
            })
        }

        res.redirect(link.url)

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
})

app.get("/api/links", async (req, res) => {
    try {
        const links = await Link.findOne({});

        return res.json({
            success: true,
            data: links,
            message: ("All Links Fetch Succefully ")
        })
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
})
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
    connectDB();
});

