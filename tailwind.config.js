module.exports = {
  content: ["./src/views/**/*.{html,ejs,js}"],
  theme: {
    extend: {    
        colors:{
            "login-bg": "#000000",
            "white-color": "#C8C8C8"
        },
        fontFamily: {
            heading: ["Poppins", "sans-serif"]
        }
    },

  },
  plugins: [],
}
