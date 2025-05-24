import nodeMailer from "nodemailer";
import fsExtra from "fs-extra";
import path from "path";
import Logger from "file-error-logging/dist/cjs";
import "dotenv/config";

class MailerService {
	private static instance: MailerService;
	private transporter: nodeMailer.Transporter;
	private emailTemplates: { [key: string]: { [language: string]: string } } =
		{};

	private constructor() {
		this.transporter = nodeMailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: parseInt(process.env.EMAIL_PORT as string),
			secure: process.env.EMAIL_SECURE === "true",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		this.loadEmailTemplates();
	}

	private async loadEmailTemplates(): Promise<void> {
		const templateDir = path.join(__dirname, "../emails");
		const files = await fsExtra.readdir(templateDir);

		for (const file of files) {
			const [templateName, language] = file.replace(".html", "").split(".");
			if (!this.emailTemplates[templateName]) {
				this.emailTemplates[templateName] = {};
			}
			const template = await fsExtra.readFile(
				`${templateDir}/${file}`,
				"utf-8",
			);
			this.emailTemplates[templateName][language] = template;
		}

		this.logInfo("Email templates loaded");
	}

	public static getInstance(): MailerService {
		if (!this.instance) this.instance = new MailerService();
		return this.instance;
	}

	public async sendEmail(
		to: string,
		subject: string,
		html: string,
	): Promise<void> {
		await this.transporter.sendMail({
			from: process.env.EMAIL_FROM,
			to,
			subject,
			html,
		});

		this.logInfo(`Email sent to ${to} with subject: ${subject}`);
	}

	public async getEmailHTMLTemplate(
		template: string,
		language: string,
		data: { [key: string]: string },
	): Promise<string> {
		const emailTemplate = this.emailTemplates[template]?.[language];
		if (!emailTemplate) {
			this.logError(
				`Email template ${template} not found for language ${language}`,
			);
			return "";
		}

		let populatedTemplate = emailTemplate;
		for (const key in data) {
			populatedTemplate = populatedTemplate.replace(`{{${key}}}`, data[key]);
		}

		return populatedTemplate;
	}

	private logInfo(message: string): void {}

	private logError(message: string): void {
		Logger.log("error", message);
	}
}

export default MailerService.getInstance();
