// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	devServer: {
		port: 3080,
	},
	modules: ["@unocss/nuxt", "nuxt-cron"],
	runtimeConfig: {
		discordBotToken: "",
		discordGuildId: "",
		discordClientId: "",
		discordNewsChannel: "",
		discordActivationChannel: "",
		discordRoleId: "",
		directusToken: "",
		directusUrl: "",
	},
});
