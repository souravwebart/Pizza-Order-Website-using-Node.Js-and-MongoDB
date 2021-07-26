const Menu = require('../../models/menu')

function homeController(){
    return {
        async index (req, res) {
            const pizzas = await Menu.find()
            return res.render('home', {pizzas: pizzas})
        },
        async menudetails (req, res){
            const pizzas = await Menu.find()
            return res.render('customers/menu', {pizzas: pizzas})
        },
        offerIndex (req, res){
            return res.render('customers/offer')
        }
    }
}

module.exports = homeController