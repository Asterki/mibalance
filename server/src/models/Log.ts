import mongoose, { Document } from "mongoose";

export type ILog = Document & {
	_id: mongoose.Types.ObjectId;
	date: Date;
	source: string;
	level: "info" | "warning" | "error" | "critical" | "debug" | "important";
	message: string;
	details?: Record<string, any>;
	metadata?: Record<string, any>;
};

const logSchema = new mongoose.Schema<ILog>({
	date: { type: Date, required: true },
	source: {
		type: String,
		required: true,
	},
	level: {
		type: String,
		enum: ["info", "warning", "error", "critical", "debug", "important"],
		required: true,
	},
	message: { type: String, required: true },
	details: { type: Map, of: mongoose.Schema.Types.Mixed },
	metadata: { type: Map, of: mongoose.Schema.Types.Mixed },
});

const LogModel = mongoose.model<ILog>("Log", logSchema);

export default LogModel;
