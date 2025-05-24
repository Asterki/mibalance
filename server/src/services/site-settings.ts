// The purpose of this file is to have a central configuration place to configure the site without having
// To make code changes all throught the site
const settings = {
  features: {
    accounts: true,
    profiles: true,
    email: true
  },
  accounts: {
    allowEmailChange: true,
    allowPasswordChange: true,
    allowProfileChange: true,
    allowRegister: true,
    allowAccountDeletion: true,
    allowTFA: true,
    allowPasswordReset: true,
  },
  site: {
    name: "Site Name",
    description: "Site Description",
    logo: "/logo.png",
  },
  theme: {
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
  },
}
