const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const database = mysql.createConnection({
    host : 'localhost',
    user : 'fiqnh',
    password : 'asd123',
    database : 'tokoasih',
    port : 3306

})

const PORT = 4000
const app = express()

database.connect()
app.use(cors())
app.use(bodyParser.json())
app.get('/', (req, res) => {
    res.status(200).send(`<h1>API UJIAN BERHASIL</h1>`)
})

// ========================================= get query pertable

//table 1 get category ;
app.get('/categories', (req, res) => {
    const query = `select c.id, c.category as category,
    c2.category as parentCategory
    from categories c
    left join categories c2
    on c.parentId = c2.id;`

    database.query(query, (err, result) => {
        if(err) return res.status(500).send(err)
        res.status(200).send(result)
    })
})

//table 2 get product ; 
app.get('/products', (req, res) => {
    const query = `select * from products;`
    database.query(query, (err, result) => {
        if(err) return res.status(500).send(err)
        res.status(200).send(result)
    })
})

//table3 get productpercategory ;
app.get('/productpercategory', (req, res) => {
    const query = `select c.id, p.id as id_product, p.nama, c.category from categories c
    left join productcat pc
    on c.id = pc.categoryId
    left join products p
    on p.id = pc.productId
    having p.id is not null
    ;`
    database.query(query, (err, result) => {
        if(err) return res.status(500).send(err)
        res.status(200).send(result)
    })
})

//list Product or get list child category ;
app.get('/listchildcategory', (req, res) => {
    const query = `select c.id, c.category from categories c
    left join categories c2
    on c.id = c2.parentId
    where c2.id is null;`
    database.query(query, (err, result) => {
        if(err) return res.status(500).send(err)
        res.status(200).send(result)
    })
})

// ========================================= table 1

//delete category table 1;
app.delete('/categories/:id', (req,res) => {
    console.log(req.params)
    const query = `DELETE FROM categories WHERE id = ${req.params.id}`;
    
    database.query(query,(err,results) => {
        if(err) {
            return res.status(500).send(err)
        }

        console.log(results)
        res.status(200).send(results)
    })
})

//edit category table 1 ;
app.put('/categories/:id', (req,res) => {
    console.log(req.params)
    console.log(req.body)

    const query = `UPDATE categories SET ? WHERE id = ${req.params.id}`
    console.log(query)
    database.query(query, req.body, (err,results) => {
        if(err) {
            return res.status(500).send(err)
        }

        console.log(results)
        res.status(200).send(results)
    })
})

//add category table 1 ;
app.post('/categories', (req,res) => {
    console.log('Query : ',req.query)
    console.log('Body : ', req.body)

    const query = `INSERT INTO categories SET ? ;`

    database.query(query, req.body, (err,results) => {
        if(err) {
            return res.status(500).send(err)
        }

        // console.log(results)
        res.status(200).send(results)
    })
})

// ========================================== table 2

// render select table 2 ;
app.get('/renderselect', (req, res) => {
    const query = `select * from categories;`
    database.query(query, (err, result) => {
        if(err) return res.status(500).send(err)
        res.status(200).send(result)
    })
})

// add products table 2 ;
app.post('/addproducts', (req,res) => {
    
    const query = `INSERT INTO products SET ?`
    database.query(query, req.body, (err, result) => {
        if(err) return res.status(500).send(err)
        res.status(200).send(result)
    })
    
})

// edit products table 2 berhasil;

app.put('/editproducts/:id', (req,res) => {
    console.log(req.params)
    console.log(req.body)

    const query = `UPDATE products SET ? WHERE id = ${req.params.id}`
    console.log(query)
    database.query(query, req.body, (err,results) => {
        if(err) {
            return res.status(500).send(err)
        }
        console.log(results)
        res.status(200).send(results)
    })
})

// delete product table 2;

app.delete('/deleteProductstable2/:id', (req, res) => {
    const query = `DELETE FROM products WHERE id = ${req.params.id}`
    console.log(req.params.id)
    database.query(query, (err, result) => {
        if(err) return res.status(500).send(err)
        res.status(200).send(result)
    })
})

// ================================================== table 3
// render select option products table 3 ;
app.get('/renderselectproduct', (req, res) => {
    const query = `select * from products;`
    database.query(query, (err, result) => {
        if(err) return res.status(500).send(err)
        res.status(200).send(result)
    })
})

// render select option category child table 3
app.get('/renderselectcategorychild', (req, res) => {
    const query = `select c.id, c.category from categories c
    left join categories c2
    on c.id = c2.parentId
    where c2.id is null;`
    database.query(query, (err, result) => {
        if(err) return res.status(500).send(err)
        res.status(200).send(result)
    })
})

app.get('/rendertable3', (req, res) => {
    const query = `select c.id, p.id as id_product, p.nama, c.category from categories c
    left join productcat pc
    on c.id = pc.categoryId
    left join products p
    on p.id = pc.productId
    having p.id is not null
    ;`
    database.query(query, (err, result) => {
        if(err) return res.status(500).send(err)
        res.status(200).send(result)
    })
})


//delete table 3 product dan category
app.delete('/deleteproducttable3/:id', (req, res) => {
    const product_id = parseInt(req.params.id)
    // delete prodoct
    const deleteProduct = `DELETE FROM productcat WHERE productId = ?`
    database.query(deleteProduct, [product_id], (err, result) => {
        if (err) return res.status(500).send(err)
        console.log(result)
        res.status(200).send(result)
    })
})

app.listen(PORT, () => console.log(`API UJIAN BERHASIL AKTIF DI PORT : ${PORT}`))


