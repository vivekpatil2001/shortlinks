import Link from "./model/Links.js ";
import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());






const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    if (conn) {
        console.log(`mongoDB connected Succesfully`)
    }
};

connectDB();

app.post("/link", async (req, res) => {

    const { url, slug } = req.body;



    const randomSlug = Math.random().toString(36).substring(2, 7);

    const linkObj = new Link({
        url: url,
        slug: slug || randomSlug
    })


    try {
        const savedLink = await linkObj.save();

        return res.json({
            success: true,
            data: {
                shortUrl:`${process.env.BASE_URL}/${savedLink.slug}`
            },
            message: "Link created succesfully"
        })
    }

    catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }

})

app.get("/:slug", async (req, res) => {
    try {
        const { slug } = req.params;

        const link = await Link.findOne({ slug: slug });

        if (!link) {
            return res.json({
                success: false,
                message: "link not found"
            })
        }

        await link.updateOne({ slug: slug }, {$set:{clicks: link.clicks + 1} })

        res.redirect(link.url)

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
})

app.get("/api/links", async (req, res) => {
  
        const links = await Link.find();
        try {

            res.json({
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
const PORT = 3000;


app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
   
});

