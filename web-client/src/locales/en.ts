const translation = {
	common: {
		page: {
			good: "Good",
			morning: "morning",
			afternoon: "afternoon",
			"not-you": "Not you? Log in with a different account",
			login: "Login",
		},
	},

	accounts: {
		login: {
			title: "Login to your account",
			description: "Please, provide your email and password to login",

			errorTitle: "Error",
			errors: {
				"invalid-credentials":
					"The password and email combination you provided does not correspond to any account",
				"invalid-parameters":
					"Please, make sure that you provided all the required information",
				unauthorized: "Unauthorized",
				"internal-error": "An internal error occurred, please try again later",
				unauthenticated: "Your session has expired, please log in again",
			},

			fields: {
				email: "Email",
				emailPlaceholder: "Email",
				password: "Password",
			},

			submit: "Login",
			forgotPassword: "Forgot your password? Click here",
		},
		forgotPassword: {
			title: "Forgot Password",
			submit: "Submit",
			disabled: "Password reset has been disabled for this platform",

			desc: "Enter the email asociated with your account on the form below, we will send an email with further instructions",

			emailSent: "An email was sent to the provided email address",

			fields: {
				email: "Email",
				emailPlaceholder: "account@example.com",
			},
			errors: {
				"invalid-email": "The email you provided is invalid",
				"email-not-found":
					"The email provided was not found as a registered account",
				"internal-error": "An internal error occurred, please try again later",
			},
			errorTitle: "Error",
		},
	},

	main: {
		home: {
			good: "Good",
			morning: "morning",
			afternoon: "afternoon",
			evening: "evening",

			"not-you": "Not you? Click here to log in with a different account",
			login: "Login",

			loading: "Loading your account...",
		},
	},

	profile: {
		messages: {
			// Success Messages
			"preferences-updated": "Your preferences have been updated",
			"profile-updated": "Your profile has been updated",
			"pfp-updated": "Your profile picture has been updated",
			"password-updated": "Your password has been updated",
			"email-updated":
				"Your email has been updated, please check your inbox for a confirmation email",
			"verification-email-sent":
				"A verification email has been sent to the provided email address",
			"email-already-verified": "The email you provided is already verified",
			"two-factor-enabled": "Two factor authentication has been enabled",
			"two-factor-disabled": "Two factor authentication has been disabled",
			"delete-success": "Your account has been deleted",

			// Error Messages - Authentication & Security
			"invalid-credentials": "The password you provided is incorrect",
			"invalid-tfa-code":
				"The two factor authentication code you provided is incorrect",
			"tfa-not-enabled":
				"Two factor authentication is not enabled for this account",
			"failed-to-generate-secret":
				"Failed to generate a two factor authentication secret, please try again later",

			// Error Messages - Email
			"invalid-email": "The email you provided is invalid",
			"email-in-use": "The email you provided is already in use",

			// Error Messages - Password
			"password-too-short": "Password must be at least 8 characters long",
			"password-too-long": "Password must be at most 255 characters long",
			"passwords-mismatch": "The passwords you provided do not match",

			// Error Messages - Required Fields
			"current-password-required": "Current password is required",
			"new-password-required": "New password is required",
			"new-email-required": "New email is required",
			"password-required": "Password is required",

			// General Errors
			"invalid-parameters":
				"Please, make sure that you provided all the required information",
			"internal-error": "An internal error occurred, please try again later",
		},
		modals: {
			tfa: {
				title: "Two Factor Authentication",
				enable: {
					"text-1":
						"Scan this QR Code with an authenticator App and enter resulting code below",
					"text-2":
						"If you can't scan the QR code, you can manually enter the code below",
					secret: "Secret",
					code: "Code",
					password: "Password",
					submit: "Enable",
				},
				disable: {
					text: "Two Factor Authentication is enabled. To disable it, enter your password and the code from your authenticator app below",
					disable: "Disable",
				},
			},
			deleteAccount: {
				title: "Delete Account",
				text: "Are you sure you want to delete your account? This action is irreversible.",
				password: "Password",
				twoFactor: "Two Factor Authentication Code",
				submit: "Delete",
			},
			updateEmail: {
				title: "Update Email",
				text: "Enter your current password and the new email you want to use",
				current: "Current Password",
				new: "New Email",
				submit: "Update",
			},
			updatePassword: {
				title: "Update Password",
				text: "Enter your current password and the new password you want to use",
				current: "Current Password",
				new: "New Password",
				confirm: "Confirm Password",
				submit: "Update",
			},
		},

		welcome: "Welcome to the profile page, {{name}}",
		personal: {
			title: "Personal Details",
			displayName: "Display Name",
			changeProfilePicture: "Change Profile Picture",
			website: "Website",
			bio: "Bio",
		},
		preferences: {
			title: "Preferences",
			displayLanguage: "Display Language",
			spanish: "Spanish",
			english: "English",
			theme: "Theme",
			light: "Light",
			dark: "Dark",
		},
		security: {
			title: "Security Settings",
			enableTwoFactor: "Enable Two Factor Authentication",
			disableTwoFactor: "Disable Two Factor Authentication",
			changePassword: "Change Password",
			changeEmail: "Change Email",
			resendVerificationEmail: "Resend Verification Email",
			deleteAccount: "Delete Account",
		},

		saveChanges: "Save Changes",
	},

	pos: {
		index: {
			page: {
				title: "Point of Sale",
				description: "Welcome to the Point of Sale",
			},
			session: {
				title: "POS Session",
				description: "Here are the details of your current session",
				close: "Close Session",
				openedAt: "Opened At",
				starting: "Starting Amount",
				status: "Status",
				store: "Store",
				open: "Open",
				closed: "Closed",
			},
			sales: {
				title: "Sales",
				description: "Manage your sales from this panel.",
				newSale: "New Sale",
				viewSales: "View Sales",
			},
			purchases: {
				title: "Purchases",
				description: "Manage your purchases from this panel.",
				newPurchase: "New Purchase",
				viewPurchases: "View Purchases",
			},

			modals: {
				closeSession: {
					title: "Close POS Session",
					description: "Are you sure that you want to end this POS session?",
					confirm: "Close POS Session",
					cancel: "Cancel",
				},
			},
		},

		"open-session": {
			title: "Open Cash Register",
			description:
				"Open a new cash register session, enter the starting amount",
			placeholder: "Enter the starting amount",
			cancel: "Cancel",
			open: "Open Cash Register",
			"select-store": "Select Store",

			messages: {
				"invalid-amount": "The amount you provided is invalid",
				"amount-required": "The starting amount is required",
				"select-store": "Please select a store",
			},
		},

		sales: {
			refund: {
				page: {
					title: "Process Sale Refund",
					description:
						"To initiate a refund for the selected sale, please complete all required fields below.",
				},
				table: {
					product: "Product Name",
					originalQuantity: "Original Quantity Sold",
					quantityToRefund: "Quantity to Refund",
					amount: "Refund Amount per Product",
				},
				modals: {
					confirm: {
						title: "Confirm Refund Request",
						description:
							"Are you certain you wish to proceed with this refund? This action is irreversible, and no further refunds will be permitted for this sale.",
					},
				},
				details: {
					title: "Refund Information",
					reason: "Reason for Refund",
					reasonPlaceholder: "Specify the reason for this refund request",
					notes: "Additional Notes",
					notesPlaceholder:
						"Enter any additional information relevant to this refund",
				},
				submit: "Submit Refund Request",
			},

			new: {
				page: {
					title: "New Sale",
					description: "Create a new sale",
				},
				actions: {
					addProduct: "Add Product",
					completeSale: "Complete Sale",
					cancelSale: "Cancel Sale",
					printReceipt: "Print Receipt",
				},
				saleSummary: {
					title: "Sale Summary",
					totalItems: "Total Items",
					totalPrice: "Total Price",
				},
				saleDetails: {
					title: "Sale Details",
					customerName: "Customer Name",
					customerNamePlaceholder: "Enter customer name",
					customerRTN: "Customer RTN",
					customerRTNPlaceholder: "Enter customer RTN (optional)",
					customerPhone: "Customer Phone",
					customerPhonePlaceholder: "Enter customer phone (optional)",
					customerEmail: "Customer Email",
					customerEmailPlaceholder: "Enter customer email (optional)",
					transactionDate: "Transaction Date",
					store: "Store",
					storeTooltip:
						"The store is automatically selected based on your current session",
				},
				productList: {
					title: "Product List",
					selectWarehouse: "Select Warehouse",
					addByBarcode: "Add by Barcode",
					addByBarcodePlaceholder: "Scan or enter barcode",
					searchProduct: "Search for a product",
					searchProductPlaceholder: "Search for a product",
					productNotFound:
						"The provided barcode does not correspond to any product",
					table: {
						image: "Product Image",
						name: "Product Name",
						barcode: "Barcode",
						unitPrice: "Selling Price",
						quantity: "Quantity",
						totalPrice: "Total Price",
						actions: "Actions",
					},

					tableActions: {
						edit: "Edit",
						remove: "Remove",
					},
				},
				paymentDetails: {
					title: "Payment Details",
					button: "Add Payment Method",
				},
				modals: {
					confirmSale: {
						title: "Confirm Sale",
						description: "Are you sure you want to make this sale?",
						create: "Create Sale",
						messages: {
							success: "Sale was created successfully",
							error: "There was an internal error creating the sale",
						},
					},
					payment: {
						title: "Payment",

						receipt: {
							title: "Receipt",
							description: "Print the receipt for this sale",
							yes: "Include Receipt",
							no: "Do not include receipt",
						},

						taxes: {
							title: "Taxes",
							description:
								"Select the taxes to apply to this sale, some items may have taxes already applied, these will not be added again",
							placeholder: "Select Taxes",
						},

						totalAmount: {
							title: "Total Amount",
							subtotal: "Subtotal",
							discount: "Discount",
							tax: "Tax",
							shipping: "Shipping",
							total: "Total",
						},

						discount: {
							title: "Discount",
							description: "Enter the discount amount or percentage",
							amount: "Amount",
							percentage: "Percentage",
						},

						method: {
							title: "Payment Method",
							description: "Select the payment method for this sale",
							cash: "Cash",
							card: "Card",
							transfer: "Transfer",

							cashMethod: {
								title: "Cash",
								amount: "Amount",
								amountPlaceholder: "Enter the cash amount received",
								change: "Change",
								changePlaceholder: "Change to be returned to the customer",
							},
						},

						completeSale: "Complete Sale",
						messages: {
							success: "Sale created successfully",
							error: "There was an error creating the sale",
							"invalid-date": "Invalid date format",
							"invalid-store": "Invalid store",
							"invalid-name": "Invalid customer name",
							"empty-sale": "Sale cannot be empty",
							"invalid-quantity": "Invalid quantity",
							"invalid-discount": "Invalid discount",
							"invalid-tax": "Please select at least one tax",
							"invalid-payment-method": "Please select a payment method",
							"invalid-payment": "Please make sure that the payment is valid",
							"invalid-payment-amount":
								"Make sure that the client pays the correct amount",
							"invalid-warehouse": "Please select a warehouse",
						},
					},
				},
			},
		},
	},

	dashboard: {
		common: {
			loggedInAs: "Currently logged in as {{name}} ({{email}})",
			create: "Create",
			search: "Search",
			cancel: "Cancel",
			delete: "Delete",
			edit: "Edit",
			view: "View",
			save: "Save",
			close: "Close",
			actions: "Actions",
			confirm: "Confirm",
			loading: "Loading",
			noResults: "No results",
			yes: "Yes",
			no: "No",
			loadMore: "Load More",
			description: "Description",
			name: "Name",
			tags: "Tags",
			actionNecessary: "Action Necessary",
			actionNotNecessary: "Action Not Necessary",
			actionNotAllowed: "Action Not Allowed",
			optional: "Optional",
			showCount: "{{count}} per page",
			page: "Page {{page}}",
		},

		errors: {
			"internal-error": "An internal error occurred, please try again later",
		},

		stock: {
			page: {
				title: "Stock Management",
				description:
					"Monitor and manage the inventory levels of all your products across different warehouses from this centralized panel.",
				searchPlaceholder:
					"Search for products by name, barcode, or category...",
				manageProducts: "Go to Product Management",
				manageWarehouses: "Go to Warehouse Management",
				stockValue: "Total Stock Value",
			},

			selectWarehouse: "Select a warehouse to view its current product stock.",

			notice:
				"You don’t need to manually create stock entries. Product and warehouse stock records are generated automatically when you add a new product or warehouse. These records are also kept up to date whenever you record purchases or sales, ensuring your inventory remains accurate in real-time.",

			table: {
				product: "Product Name",
				barcode: "Product Barcode",
				category: "Product Category",
				quantity: "Available Stock",
				actions: "Actions",
				editStock: "Adjust Stock Quantity",
			},

			modals: {
				adjustStock: {
					title: "Adjust Product Stock",
					description:
						"Manually update the stock quantity for this product. Use this option only if you're certain the current stock level is incorrect. For routine updates, such as new inventory or sales, it's recommended to create a purchase or sale record instead.",
					quantity: "Updated Quantity",
					quantityPlaceholder: "Enter the new stock quantity",
					messages: {
						error:
							"Something went wrong while updating the stock. Please try again.",
						success: "Stock quantity was successfully updated.",
						"not-negative": "Stock quantity cannot be less than zero.",
					},
				},
			},
		},

		sales: {
			page: {
				title: "Sales",
				description: "View and manage all sales made through the POS system.",
				createSale: "New Sale",
				searchPlaceholder: "Search by customer name or receipt number...",
			},

			table: {
				date: "Date",
				customer: "Customer",
				total: "Total Amount",
				paymentMethod: "Payment Method",
				status: "Payment Status",
				store: "Store",
				employee: "Processed By",
				actions: "Actions",
				receipt: "Receipt #",

				editTooltip: "Edit this sale",
				deleteTooltip: "Delete this sale",
				viewTooltip: "View sale details",
				printReceiptTooltip: "Print receipt",

				saleCount: "{{total}} sales found",

				searchByReceipt: "Filter by receipt number",
				searchByCustomer: "Filter by customer name",

				paid: "Paid",
				unpaid: "Unpaid",
				partially_paid: "Partially Paid",
			},

			modals: {
				delete: {
					title: "Delete Sale",
					description:
						"Are you sure you want to delete this sale? This action cannot be undone. This will not restore the stock of the products sold. If you wish to restore the stock, please do it via a refund.",
					messages: {
						success: "Sale was deleted successfully.",
						error:
							"There was an error trying to delete the sale. Please try again.",
					},
				},

				selected: {
					title: "Sale Details",
					generalInfo: {
						title: "General Information",
						receipt: "Receipt Number",
						date: "Date",
						store: "Store",
						processedBy: "Processed By",
					},
					customerInfo: {
						title: "Customer Information",
						name: "Name",
						email: "Email",
						phone: "Phone",
						rtn: "RTN",
					},
					payment: {
						title: "Payment Information",
						total: "Total Amount",
						totalPaid: "Total Paid",
						change: "Change Given",
						status: "Payment Status",
					},
					products: {
						title: "Products",
						product: "Product",
						quantity: "Quantity",
						unitPrice: "Unit Price",
						total: "Total",
					},
				},
			},
		},

		warehouses: {
			page: {
				title: "Warehouse Management",
				description:
					"View your list of warehouses, create new locations, edit existing entries, and manage your inventory distribution across multiple sites.",
				createWarehouse: "Add New Warehouse",
				manageStock: "Adjust and Monitor Inventory",
				searchPlaceholder: "Search by warehouse name, address, or tags...",
			},

			table: {
				name: "Warehouse Name",
				description: "Brief Description",
				address: "Physical Address",
				tags: "Tags or Categories",
				actions: "Available Actions",
				editTooltip: "Edit this warehouse’s details",
				deleteTooltip: "Permanently delete this warehouse",
			},

			modals: {
				create: {
					title: "Add a New Warehouse",
					modalDescription:
						"Complete the fields below to register a new warehouse. Make sure to include accurate information to help with inventory routing and logistics.",
					name: "Warehouse Name",
					namePlaceholder:
						"Enter a name to identify this warehouse (e.g., 'Downtown Distribution Center')",
					description: "Short Description",
					descriptionPlaceholder:
						"Provide a short summary of this warehouse’s purpose or characteristics",
					address: "Street Address",
					addressPlaceholder:
						"Enter the full address of this warehouse (e.g., '123 Industrial Rd, Suite 400')",
					tags: "Keywords or Tags",
					tagsPlaceholder:
						"Add relevant tags (e.g., cold-storage, high-priority, overflow)",
					messages: {
						"invalid-name-length":
							"Warehouse name must be between 1 and 100 characters.",
						"invalid-description-length":
							"Description must be between 1 and 300 characters.",
						"invalid-address-length":
							"Address must be between 5 and 200 characters.",
						"invalid-tags-length": "Tags must be an array of short strings.",
						"invalid-tags":
							"Please provide tags as an array of words or phrases.",
						success: "Warehouse was created successfully.",
						error:
							"Something went wrong while trying to create the warehouse. Please try again.",
					},
				},
				delete: {
					title: "Confirm Warehouse Deletion",
					description:
						"This action will permanently remove the selected warehouse and all associated data. Are you absolutely sure you want to proceed?",
					messages: {
						success: "Warehouse was successfully deleted.",
						error:
							"There was a problem deleting the warehouse. Please try again later.",
					},
				},
				update: {
					title: "Edit Warehouse Details",
					modalDescription:
						"Modify the fields below to update this warehouse’s information. All changes will be saved immediately upon confirmation.",
					name: "Warehouse Name",
					namePlaceholder: "Update the warehouse’s name (e.g., 'North Hub')",
					description: "Description",
					descriptionPlaceholder:
						"Update the summary or purpose of this warehouse",
					address: "Address",
					addressPlaceholder: "Update the warehouse’s physical location",
					tags: "Tags",
					tagsPlaceholder:
						"Edit or add tags for better categorization and filtering",
					messages: {
						"invalid-name-length":
							"Warehouse name must be between 1 and 100 characters.",
						"invalid-description-length":
							"Description must be between 1 and 300 characters.",
						"invalid-address-length":
							"Address must be between 5 and 200 characters.",
						"invalid-tags-length": "Tags must be an array of strings.",
						"invalid-tags": "Tags must be a list of short strings or keywords.",
						success: "Warehouse details have been successfully updated.",
						error:
							"An error occurred while updating the warehouse. Please check your entries and try again.",
					},
				},
			},
		},

		roles: {
			page: {
				title: "Account Roles",
				description: "Create, manage and delete roles.",
				createRole: "Create a Role",
				searchPlaceholder: "Search Roles",
				returnToAccounts: "Return to Accounts",
			},

			table: {
				name: "Name",
				level: "Level",
				totalPermissions: "Total Permissions",
				actions: "Actions",
				editTooltip: "Edit Role",
				deleteTooltip: "Delete Role",
			},

			modals: {
				delete: {
					title: "Delete Role",
					description:
						"Are you sure you want to delete this role? This action is irreversible.",
					messages: {
						success: "Role deleted successfully",
						error: "There was an error trying to delete the role",
					},
				},

				create: {
					title: "Create Role",
					description: "Fill the corresponding fields to create a role",
					name: "Name",
					namePlaceholder: "Role Name",
					level: "Level",
					levelPlaceholder: "Role Level",
					messages: {
						"invalid-name": "Name must be between 1 and 100 characters.",
						"invalid-level": "Level must be a positive number.",
						"level-in-use": "Level is already in use by another role.",
						"level-too-high":
							"You can't create a role with a level higher than your own.",
						success: "Role created successfully",
						error: "There was an error creating the role",
					},
				},

				update: {
					title: "Update Role",
					description: "Fill the corresponding fields to update a role",
					name: "Name",
					namePlaceholder: "Role Name",
					level: "Level",
					levelPlaceholder: "Role Level",
					requiresTwoFactor: "Requires Two Factor Authentication",
					requiresTwoFactorTooltip:
						"This role requires two factor authentication to access the platform",
					permissions: "Permissions",
					permissionsPlaceholder: "Select Permissions",
					create: "Create",
					update: "Update",
					delete: "Delete",
					refund: "Refund",
					view: "View",
					discount: "Discount",
					enableAll: "Enable All",
					products: "Products",
					purchases: "Purchases",
					sales: "Sales",
					warehouses: "Warehouses",
					roles: "Roles",
					accounts: "Accounts",
					settings: "Settings",
					reports: "Reports",
					categories: "Categories",
					stores: "Stores",
					suppliers: "Suppliers",
					messages: {
						"invalid-name-length": "Name must be between 1 and 100 characters.",
						"invalid-level": "Level must be a positive number.",
						"level-in-use": "Level is already in use by another role.",
						"level-too-high":
							"You can't create a role with a level higher than your own.",
						"invalid-permissions":
							"You can't give a role a permission that you don't have.",
						success: "Role updated successfully",
						error: "There was an error updating the role",
					},
				},
			},
		},

		products: {
			page: {
				title: "Product Catalog",
				description:
					"Add, view, edit, or remove products from your inventory. Organize products into categories to streamline inventory and sales tracking.",
				createProduct: "Add New Product",
				manageCategories: "Organize Product Categories",
				searchPlaceholder: "Search products by name, barcode, or category...",
			},

			table: {
				image: "Product Image Preview",
				barcode: "Product Barcode",
				name: "Product Name",
				category: "Product Category",
				sellingPrice: "Selling Price (Customer-facing)",
				costPrice: "Cost Price (Internal)",
				actions: "Actions",
				missingCategoryTooltip:
					"This product's category has been deleted. Please assign a new category to maintain organization.",
				editTooltip: "Edit product details",
				printBarcodesTooltip: "Generate printable barcodes",
				statisticsTooltip: "View product performance metrics",
				deleteTooltip: "Remove product permanently",
			},

			modals: {
				generateBarcode: {
					title: "Generate Barcodes",
					description:
						"Enter the number of unique barcodes to generate for this product.",
					count: "Quantity",
					countPlaceholder: "e.g., 10",
					generate: "Generate Barcodes",
					messages: {
						error: "Failed to generate barcodes. Please try again.",
						success:
							"Barcodes generated successfully. Your download will begin shortly.",
					},
				},

				delete: {
					title: "Delete Product",
					description:
						"Are you sure you want to permanently delete this product? This action cannot be undone.",
					messages: {
						success: "Product deleted successfully.",
						error:
							"An error occurred while deleting the product. Please try again later.",
					},
				},

				create: {
					create: "Add Product",
					description:
						"Enter the product details below to add it to your inventory.",
					name: "Product Name",
					namePlaceholder: "Enter product name (e.g., 'Wireless Mouse')",
					barcode: "Barcode",
					barcodePlaceholder: "Enter or generate a unique product barcode",
					generateBarcodeTooltip: "Click to auto-generate a barcode",
					category: "Product Category",
					selectCategory: "Choose a category",
					sellingPrice: "Selling Price",
					sellingPricePlaceholder: "Enter the price you sell this product for",
					costPrice: "Cost Price",
					costPricePlaceholder: "Enter how much this product costs you",
					messages: {
						"invalid-name":
							"Product name must be between 1 and 100 characters.",
						"invalid-category": "Please select a valid product category.",
						"invalid-selling-price": "Selling price must be a positive number.",
						"invalid-cost-price": "Cost price must be a positive number.",
						"invalid-barcode": "Barcode must be between 1 and 32 characters.",
						"price-lower-than-cost":
							"Warning: The selling price is lower than the cost price.",
						warning: "Please review the highlighted fields before proceeding.",
						error: "An error occurred while creating the product.",
						success: "Product added to inventory successfully.",
					},
				},

				update: {
					title: "Edit Product",
					description:
						"Update any details related to this product using the sections below.",

					general: {
						title: "Basic Information",
						name: "Product Name",
						namePlaceholder: "Update the name of the product",
						description: "Product Description (Optional)",
						descriptionPlaceholder:
							"Provide more details about the product (features, brand, etc.)",
						barcode: "Barcode",
						barcodePlaceholder: "Edit or regenerate the barcode",
						generateBarcode: "Generate New Barcode",
						images: "Product Images (Optional)",
						imagesUpload: "Click or drag files to upload images",
						deleteImageTooltip: "Remove this image",
						currentImagesPreview: "Current Product Images",
					},

					categories: {
						title: "Categories",
						category: "Main Category",
						selectCategory: "Choose the main category",
						subcategories: "Subcategories",
						selectSubcategories: "Select all that apply",
					},

					productInformation: {
						title: "Product Specifications",
						type: "Product Type",
						typePlaceholder:
							"Choose whether this is a physical or digital product",
						physical: "Physical Item",
						digital: "Digital Item",
						unit: "Measurement Unit",
						unitPlaceholder:
							"Select how this product is measured (e.g., piece, box, liter)",
						physicalInformation: "Include physical dimensions?",
						width: "Width (cm)",
						height: "Height (cm)",
						depth: "Depth (cm)",
						weight: "Weight (kg)",
						physicalInformationNotice: "If not applicable, set to 0",
					},

					prices: {
						title: "Pricing Details",
						sellingPrice: "Retail Price",
						sellingPricePlaceholder: "Customer-facing price",
						costPrice: "Cost to Business",
						costPricePlaceholder: "How much this item costs your company",
						taxIncluded: "Is tax included in the selling price?",
					},

					messages: {
						error: "An error occurred while updating the product.",
						warning: "Make sure all required fields are filled correctly.",
						success: "Product updated successfully.",
						"invalid-name": "Product name must be 1–100 characters long.",
						"invalid-description": "Description must be 1–400 characters long.",
						"invalid-barcode": "Barcode must be 1–32 characters long.",
						"invalid-image-urls": "Images must be valid URLs.",
						"invalid-category": "Category is required.",
						"invalid-subcategories":
							"Subcategories must be a list of text labels.",
						"invalid-type": "Select a valid product type: physical or digital.",
						"invalid-unit": "Unit of measurement is required.",
						"invalid-dimensions": "Dimensions must be non-negative numbers.",
						"invalid-weight": "Weight must be 0 or greater.",
						"invalid-physical-info": "Invalid physical details provided.",
						"invalid-selling-price": "Selling price must be a positive number.",
						"invalid-cost-price": "Cost price must be a positive number.",
						"invalid-tax-included": "Tax included must be true or false.",
						"invalid-tag": "Each tag should be between 1 and 16 characters.",
						"invalid-tags": "Tags must be a list of strings.",
						"invalid-metadata": "Metadata must be in object format.",
						"unknown-error":
							"An unknown error occurred. Please try again later.",
						"product-updated": "Product information saved successfully.",
						"barcode-already-exists":
							"This barcode is already used. Please enter a unique barcode or click 'Generate Barcode'.",
					},
				},
			},
		},

		purchases: {
			page: {
				title: "Purchases",
				description: "Create, manage and delete purchases.",
				createPurchase: "Create a Purchase",
			},

			table: {
				total: "Total Purchases",
				date: "Date",
				supplier: "Supplier",
				status: "Status",
				actions: "Actions",
				editTooltip: "Edit Purchase",
				deleteTooltip: "Delete Purchase",
				viewTooltip: "View Purchase",
			},

			modals: {
				selected: {
					title: "Purchase Details",
					generalInfo: {
						title: "General Information",
						orderDate: "Order Date",
						expectedDelivery: "Expected Delivery Date",
						actualDelivery: "Actual Delivery Date",
						store: "Store",
						processedBy: "Processed By",
					},
					supplierInfo: {
						title: "Supplier Information",
						name: "Supplier",
					},
					payment: {
						title: "Payment Information",
					},
					products: {
						title: "Purchased Products",
						product: "Product",
						quantity: "Quantity",
						unitCost: "Unit Cost",
						totalCost: "Total Cost",
					},
					attachments: {
						title: "Attachments",
					},
					status: {
						title: "Purchase Status",
					},
				},

				create: {
					title: "Create Purchase",
					description: "Fill the corresponding fields to create a purchase",

					general: {
						title: "General Information",
						status: "Status",
						selectStatus: "Select Status",
						supplier: "Supplier",
						selectSupplier: "Select Supplier",
						warehouse: "Warehouse",
						selectWarehouse: "Select Warehouse",
						store: "Store",
						selectStore: "Select Store",
						received: "Received",
						pending: "Pending",
						shipped: "Shipped",
					},
					dates: {
						title: "Dates",
						orderDate: "Order Date",
						expectedDeliveryDate: "Expected Delivery Date",
						actualDeliveryDate: "Actual Delivery Date",
					},
					products: {
						title: "Products",
						product: "Search Products",
						quantity: "Set The Quantity",
						table: {
							product: "Product Name",
							quantity: "Quantity",
							unitCost: "Unit Cost",
							totalCost: "Total Cost",
							actions: "Actions",
							deleteTooltip: "Delete Product",
						},
					},
					attachments: {
						title: "Attachments",
						description:
							"Upload any relevant documents or files related to this purchase.",
						upload: "Upload Files",
						successUpload: "Files uploaded successfully",
						successDelete: "Files deleted successfully",
						errorUpload: "There was an error uploading the files",
						errorDelete: "There was an error deleting the files",
					},
					payment: {
						title: "Payment",
						method: "Payment Method",
						selectMethod: "Select Payment Method",
						cash: "Cash",
						credit_card: "Credit Card",
						debit_card: "Debit Card",
						online: "Online Payment",
						gift_card: "Gift Card",
						split_payment: "Split Payment",
						subtotal: "Subtotal",
						subtotalTooltip:
							"This field is automatically calculated and cannot be edited",
						shippingCost: "Shipping Cost (Set to 0 if not applicable)",
						discount: "Discount",
						taxes: "Taxes",
						paymentStatus: "Payment Status",
						selectPaymentStatus: "Select Payment Status",
						paid: "Paid",
						unpaid: "Unpaid",
						"partially-paid": "Partially Paid",
						partialPayment:
							"Since you are using a partial payment method, please enter the amount paid",
					},
					messages: {
						success: "The purchase has been successfully created.",
						error:
							"An unexpected error occurred while attempting to create the purchase.",
						"invalid-supplier-id": "A valid supplier must be selected.",
						"invalid-warehouse-id": "A valid warehouse must be selected.",
						"invalid-store-id": "A valid store must be selected.",
						"invalid-order-date":
							"The order date must be a valid ISO date string.",
						"no-items":
							"At least one product must be included in the purchase.",
						"attachment-upload-success": "Files uploaded successfully.",
						"attachment-upload-error":
							"There was an error uploading the files.",
						"delete-attachment-success": "Files deleted successfully.",
						"delete-attachment-error": "There was an error deleting the files.",
						"invalid-product-id":
							"Each product entry must contain a valid product identifier.",
						"quantity-must-be-at-least-one":
							"Each product must have a quantity of at least 1.",
						"unit-cost-cannot-be-negative":
							"The unit cost for each product must be a non-negative value.",
						"attachment-name-required":
							"Each attachment must include a name field.",
						"attachment-url-required":
							"Each attachment must include a URL field.",
						"invalid-payment-method":
							"The selected payment method is not recognized or supported.",
						"subtotal-cannot-be-negative":
							"The subtotal amount must be a non-negative number.",
						"shipping-cost-cannot-be-negative":
							"The shipping cost must be a non-negative value.",
						"taxes-cannot-be-negative":
							"The tax amount must be a non-negative value.",
						"discount-cannot-be-negative":
							"The discount amount must be a non-negative number.",
						"total-paid-required":
							"The total amount paid is required and must be a valid number.",
						"invalid-status":
							"The status must be either 'pending', 'shipped', or 'received'.",
					},
				},
			},
		},

		suppliers: {
			page: {
				title: "Suppliers",
				description:
					"Add and manage your list of product suppliers. Keeping this information up to date helps streamline your procurement process.",
				createSupplier: "Add New Supplier",
				searchPlaceholder: "Search suppliers by name, email, or phone...",
			},

			table: {
				name: "Supplier Name",
				description: "Short Description",
				email: "Email Address",
				address: "Physical Address",
				phone: "Phone Number",
				website: "Website URL",
				actions: "Available Actions",
				editTooltip: "Edit supplier details",
				deleteTooltip: "Remove this supplier",
			},

			modals: {
				create: {
					title: "Add New Supplier",
					modalDescription:
						"Enter the details of the supplier you'd like to add. Contact information is optional but recommended for future communication.",
					name: "Supplier Name",
					namePlaceholder: "e.g., Global Electronics Inc.",
					description: "Supplier Description",
					descriptionPlaceholder: "Brief summary of this supplier's offerings",
					email: "Email Address",
					emailPlaceholder: "e.g., contact@supplier.com",
					address: "Address",
					addressPlaceholder: "Street, City, Country (optional)",
					phone: "Phone Number",
					phonePlaceholder: "e.g., +1 555 123 4567",
					website: "Website",
					websitePlaceholder: "e.g., https://www.supplier.com",
					messages: {
						"invalid-name-length":
							"The name must be between 1 and 100 characters.",
						"invalid-description-length":
							"The description must be between 1 and 300 characters.",
						"invalid-phone-length":
							"Phone number must be between 7 and 20 characters.",
						"invalid-email-format": "Please enter a valid email address.",
						"invalid-email-length":
							"Email must not exceed 100 characters in length.",
						"invalid-website-format": "Please enter a valid website URL.",
						"invalid-website-length":
							"Website URL must not exceed 200 characters.",
						"invalid-address-length":
							"Address must be between 5 and 200 characters.",
					},
				},

				update: {
					title: "Edit Supplier Details",
					general: "Basic Information",
					name: "Supplier Name",
					descriptionLabel: "Description",
					description: "Brief summary of this supplier’s business",

					contact: {
						title: "Contact Details",
						address: "Address",
						email: "Email Address",
						phone: "Phone Number",
						website: "Website URL",
					},

					messages: {
						"invalid-name-length":
							"The name must be between 1 and 100 characters.",
						"invalid-description-length":
							"The description must be between 1 and 300 characters.",
						"invalid-phone-length":
							"Phone number must be between 7 and 20 characters.",
						"invalid-email-format": "Please enter a valid email address.",
						"invalid-email-length": "Email must not exceed 100 characters.",
						"invalid-website-format": "Please enter a valid website URL.",
						"invalid-website-length":
							"Website URL must not exceed 200 characters.",
						"invalid-address-length":
							"Address must be between 5 and 200 characters.",
					},
				},

				delete: {
					title: "Delete Supplier",
					description:
						"Are you sure you want to permanently delete this supplier? This will remove all their contact information and cannot be undone.",
					messages: {
						success: "Supplier was successfully deleted.",
						error:
							"An error occurred while trying to delete the supplier. Please try again.",
					},
				},
			},
		},

		stores: {
			page: {
				title: "Stores",
				description:
					"Manage all your retail or warehouse locations. You can create new stores, assign managers, and update or remove existing ones.",
				createStore: "Add New Store",
				searchPlaceholder: "Search stores by name, location, or manager...",
			},

			table: {
				name: "Store Name",
				location: "Location",
				manager: "Store Manager",
				actions: "Available Actions",
				editTooltip: "Edit store details",
				deleteTooltip: "Delete this store",
			},

			modals: {
				create: {
					title: "Create New Store",
					name: "Store Name",
					namePlaceholder: "e.g., Downtown Outlet",
					location: "Location",
					locationPlaceholder: "e.g., 123 Main Street, Springfield",
					manager: "Manager",
					managerPlaceholder: "e.g., John Doe",
					messages: {
						"invalid-name": "Store name must be between 1 and 100 characters.",
						"invalid-location":
							"Location must be a valid address between 5 and 200 characters.",
						"invalid-manager": "Please select a valid manager for the store.",
						success: "Store was created successfully.",
					},
				},

				delete: {
					title: "Delete Store",
					description:
						"Are you sure you want to permanently delete this store? This action cannot be undone and will remove all related store data.",
				},

				edit: {
					title: "Edit Store Details",

					general: {
						title: "General Store Information",
						name: "Store Name",
						namePlaceholder: "e.g., Downtown Outlet",
						location: "Location",
						locationPlaceholder: "e.g., 123 Main Street, Springfield",
						manager: "Manager",
						managerPlaceholder: "e.g., John Doe",
					},

					contact: {
						title: "Store Contact Details",
						phone: "Phone Number",
						phonePlaceholder: "e.g., +1 555 987 6543",
						email: "Email Address",
						emailPlaceholder: "e.g., contact@store.com",
					},

					employees: {
						title: "Assign Employees",
						searchEmployee: "Search employees by name or ID",
						addEmployee: "Add to Store",
						notice:
							"Select employees who should be assigned to this store. You can designate one as the manager.",
						manager: "Designated Manager",
					},
				},
			},

			messages: {
				"error-fetching":
					"An error occurred while trying to retrieve the list of stores.",
				"invalid-name":
					"The store name must be between 1 and 100 characters long.",
				"invalid-location":
					"The location must be a valid address between 5 and 200 characters.",
				"invalid-manager": "Please select a valid manager for the store.",
				"create-success": "Store was created successfully.",
				"create-error":
					"There was an issue creating the store. Please try again.",
				"update-success": "Store details were updated successfully.",
				"update-error":
					"An error occurred while updating the store information.",
				"delete-success": "Store was deleted successfully.",
				"delete-error":
					"There was an error trying to delete the store. Please try again later.",
			},
		},

		categories: {
			page: {
				title: "Product Categories",
				description:
					"Define and manage categories to group similar products for better organization and easier navigation.",
				createCategory: "Add New Category",
				returnToProducts: "Back to Product List",
				searchPlaceholder: "Search categories by name or tag...",
			},

			table: {
				name: "Category Name",
				description: "Category Description",
				tags: "Associated Tags",
				image: "Category Image",
				actions: "Available Actions",
				editTooltip: "Edit this category",
				deleteTooltip: "Delete this category",
			},

			modals: {
				create: {
					title: "Add New Category",
					modalDescription:
						"Fill in the fields below to create a new product category. Categories help organize your inventory and improve searchability.",
					name: "Category Name",
					namePlaceholder: "e.g., Electronics, Office Supplies",
					description: "Detailed Description",
					descriptionPlaceholder:
						"Describe what kinds of products belong in this category",
					tags: "Keywords/Tags",
					tagsPlaceholder: "Enter tags (e.g., gadgets, paper, accessories)",
					uploadImageLabel: "Category Image (Optional)",
					uploadImage: "Upload Image",
					removeImage: "Remove Current Image",
					messages: {
						"invalid-name-length":
							"The category name must be between 1 and 100 characters.",
						"invalid-description-length":
							"The description must be between 1 and 500 characters.",
						"invalid-tags-length": "You can add up to 10 tags only.",
						"image-upload-error":
							"Could not upload the image. Please try again.",
						"image-upload-success": "Image uploaded successfully.",
						"image-delete-error":
							"Could not delete the image. Please try again.",
						"image-delete-success": "Image removed successfully.",
						success: "Category created successfully.",
						error:
							"An error occurred while creating the category. Please try again.",
					},
				},

				delete: {
					title: "Delete Category",
					description:
						"Are you sure you want to permanently delete this category? This cannot be undone and may affect associated products.",
					messages: {
						success: "Category deleted successfully.",
						error: "Failed to delete the category. Please try again later.",
					},
				},

				update: {
					title: "Edit Category",
					modalDescription:
						"Update the category details below. Use this to rename a category, change its description, tags, or update its image.",
					name: "Category Name",
					namePlaceholder: "Enter a new or updated category name",
					description: "Category Description",
					descriptionPlaceholder: "Update the description for better clarity",
					tags: "Tags/Keywords",
					tagsPlaceholder: "Update or add new tags",
					uploadImageLabel: "Upload New Image (Optional)",
					uploadImage: "Upload Image",
					removeImage: "Remove Existing Image",
					currentImage: "Current Category Image",
					messages: {
						"image-upload-error": "Image upload failed. Please try again.",
						"image-upload-success": "Image uploaded successfully.",
						"image-delete-error": "Error removing the image. Try again later.",
						"image-delete-success": "Image removed successfully.",
						"invalid-name-length":
							"The name must be between 1 and 100 characters.",
						"invalid-description-length":
							"The description must be between 1 and 500 characters.",
						"invalid-tags-length": "Only up to 10 tags are allowed.",
						success: "Category updated successfully.",
						error:
							"There was an error updating the category. Please try again.",
					},
				},
			},
		},

		accounts: {
			page: {
				title: "Accounts",
				description: "Manage user and employee accounts from this page.",
				searchPlaceholder: "Search for an account",
				manageRoles: "Manage Account Roles",
				createAccount: "Create Account",
			},

			table: {
				name: "Name",
				email: "Email",
				role: "Role",
				actions: "Actions",
				editTooltip: "Edit Account",
				deleteTooltip: "Delete Account",
			},

			modals: {
				create: {
					title: "Create Account",
					description: "Fill the corresponding fields to create an account",
					name: "Name",
					namePlaceholder: "Account Name",
					email: "Email",
					emailPlaceholder: "Account Email",
					password: "Password",
					passwordPlaceholder: "Account Password",
					role: "Role",
					selectRole: "Select Role",
					messages: {
						"invalid-name-length": "Name must be between 1 and 100 characters.",
						"invalid-email": "Email format is invalid.",
						"invalid-password-length":
							"Password must be at least 8 characters.",
						"invalid-role": "Role is required.",
						"email-in-use": "The email you provided is already in use",
						success: "Account created successfully",
						error: "There was an error creating the account",
					},
				},
				update: {
					title: "Update Account",
					description: "Fill the corresponding fields to update an account",
					name: "Name",
					namePlaceholder: "Account Name",
					email: "Email",
					emailPlaceholder: "Account Email",
					password: "Password",
					passwordPlaceholder: "Account Password",
					role: "Role",
					selectRole: "Select Role",
					disableTwoFactor: "Disable Two Factor Authentication",
					disableTwoFactorTooltip:
						"This will disable two factor authentication for this account",
					messages: {
						"invalid-name-length": "Name must be between 1 and 100 characters.",
						"invalid-email": "Email format is invalid.",
						"invalid-password-length":
							"Password must be at least 8 characters.",
						"invalid-role": "Role is required.",
						"email-in-use": "The email you provided is already in use",
						success: "Account updated successfully",
						error: "There was an error updating the account",
					},
				},
				delete: {
					title: "Delete Account",
					description:
						"Are you sure you want to delete this account? This action is irreversible.",
					messages: {
						success: "Account deleted.",
						error: "There was an error trying to delete the account.",
					},
				},
				disableTwoFactor: {
					title: "Disable Two Factor Authentication",
					description:
						"Are you sure you want to disable two factor authentication for this account? This action is irreversible.",
					messages: {
						success: "Two factor authentication has been disabled",
						error:
							"An error occurred while disabling two factor authentication",
					},
				},
				changePassword: {
					title: "Change Account Password",
					description: "Enter the new password for this account",
					passwordLabel: "New Password",
					messages: {
						success: "Password changed.",
						error:
							"There was an error trying to change this account's password.",
					},
				},
				changeRole: {
					title: "Change Account Role",
					description: "Select the role that this account will have",
					label: "Roles",
					messages: {
						success: "Role changed",
						error: "There was an error trying to change this account's role.",
					},
				},
				changeEmail: {
					title: "Change Account Email",
					description: "Set the email that the account will have",
					label: "New Email",
					messages: {
						success: "Email changed successfully",
						error: "There was an error trying to change the account's email.",
					},
				},
			},

			drawers: {
				edit: {
					title: "Edit Account",
					description: "Manage user and employee accounts from this panel.",
					fields: {
						email: "Email",
						role: "Role",
						bio: "Bio",
						noBio: "No Bio Provided",
						website: "Website",
						noWebsite: "No Website Provided",
					},
					actions: {
						securityOptions: "Security Options",
						updateOptions: "Update Options",
						update: "Update Account",
						activate: "Activate Account",
						deactivate: "Deactivate Account",
						title: "Security Options",
						changePassword: "Change Password",
						changeEmail: "Change Email",
						changeRole: "Change Role",
						disableTwoFactor: "Disable Two Factor Authentication",
					},
				},
			},

			editDrawer: {
				title: "Edit Account",
				fields: {
					email: "Email",
					role: "Role",
					bio: "Bio",
					website: "Website",
				},
				placeholders: {
					noBio: "No bio provided",
					noWebsite: "No website provided",
				},
				search: {
					byName: "Search by name",
					byRole: "Filter by role",
				},
				showingResults: "Showing {{count}} out of {{total}} accounts",

				actions: {
					create: "Create Account",
				},

				securityOptions: {},

				modals: {
					edit: {
						title: "Edit Account",
						labels: {
							name: "Name",
							email: "Email",
							role: "Role",
							bio: "Bio",
							website: "Website",
						},
						placeholders: {
							noBio: "No bio provided",
							noWebsite: "No website provided",
						},
						security: {
							title: "Security Settings",
							activate: "Activate Account",
							deactivate: "Deactivate Account",
							delete: "Delete Account",
							disableTwoFactor: "Disable Two Factor Authentication",
						},
						updateOptions: {
							title: "Update Account",
							changePassword: "Change Password",
							changeEmail: "Change Email",
							changeRole: "Change Role",
						},
					},
					tfa: {
						title: "Disable Two Factor Authentication",
						description: "Disable two factor authentication for this account",
					},
				},

				messages: {
					tfaDisabled: "Two factor authentication has been disabled",
				},

				errors: {
					emailInUse: "The email you provided is already in use",
					internalError: "An internal error occurred, please try again later",
				},
			},
		},
	},
};

export default translation;
