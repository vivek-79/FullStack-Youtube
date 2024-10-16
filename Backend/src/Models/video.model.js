
import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const videoSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    videoFile: {
        type: String,//clodanary
        required: true,
    },
    thumbnail: {
        type: String,//cloudanary
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    tags: {
        type: String
    }

}, { timestamps: true })

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)