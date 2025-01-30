const express = require('express')
const dotenv = require('dotenv')
const categoryRouter = require('./src/routers/categoryRoutes')
const subCategoryRouter = require('./src/routers/subCategoryRoutes')
const itemRouter = require('./src/routers/itemsRoutes')
dotenv.config()

const app = express()
app.use(express.json())
const Port = process.env.SERVER_PORT || 6000 ;

app.get('/' , (req , res) =>{
    res.send('Server is Ready')
})

app.use('/category' , categoryRouter) ;
app.use('/subcategory' , subCategoryRouter) ;
app.use('/items' , itemRouter) ;

// For Wrong Routes
app.use("*", (req, res) => {
    res.status(404).json({
        message: 'Endpoint not found',
        status: 'Error',
    });
});

app.listen(Port , ()=>{
    console.log(`surver is running on port ${Port}` , process.env.DB_DIALECT)  
})