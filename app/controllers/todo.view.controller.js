"use strict";
/* -------------------------------------------------------
    EXPRESSJS - TODO Project with Sequelize
------------------------------------------------------- */
// CONTROLLERS:

const Todo = require('../models/todo.model')

const PRIORITY = {
    '-1': 'Low',
    '0': 'Norm',
    '1': 'High'
}

module.exports = {

    list: async (req, res) => {

        // const data = await Todo.findAll()
        //console.log(data) => yapınca datalarımın data.rows içinde olduğunu görüyorum
        const data = await Todo.findAndCountAll({
            order: [
                ['id', 'desc']
            ]
        })

        // res.status(200).send({
        //     error: false,
        //     result: data
        // })
        //View
        // 1.parametre, hangi dosyaya gönderillecek/çalıştırılacak
        //2. parametredeki obje içinde todoList.ejs içine gönderilecek datalar var,
        // buradaki key ler ile todoList içindeki değişken adlrı aynı olmak zorunda
        res.render('todoList.ejs', { todos: data.rows, count: data.count, priority: PRIORITY })
        // data.rows ve data.count u clg(data) yaptığımızda gördük.
    },

    // CRUD:

    create: async (req, res) => {

        // const data = await Todo.create(req.body)

        // res.status(201).send({
        //     error: false,
        //     result: data.dataValues
        // })
        if (req.method == 'POST') {
            //urlden gelen method post ise datayı ekle
            //CREATE yap
            const data = await Todo.create(req.body)
            //errorhandler çalıştığı için hata yönetimine gerek yok
            // if (data) {
            //     //create başarılıysa ana sayfaya geri dön
            //     res.redirect('/view')
            // }else { //create yapılmamışsa içinde bulunduğum sayfaya geri gel
            //     res.redirect('/view/create')
            // }
            res.redirect('/view')
        } else {
            // metod get ise sadece formu göster
            //FORM Görüntüle, priority i gönder ki seçsin orda user
            res.render('todoCreate', { priority: PRIORITY })
        }

    },

    read: async (req, res) => {

        // const data = await Todo.findOne({ where: { id: req.params.id } })
        const data = await Todo.findByPk(req.params.id)
        // clg(data) yaptığımızda, data nın todos içinde dataValues objesinde geldiğini gördük

        // res.status(200).send({
        //     error: false,
        //     result: data
        // })
        //clg(data) yapınca ihtiyacımız olan verilerin dataValues içinde olduğunu gördük o yüzden onu yazdık aşağıya, parametreleri ayarlarken böyle clg yapmakta fayda var
        res.render('todoRead', { todo: data.dataValues, priority: PRIORITY })
    },

    update: async (req, res) => {

        // const data = await Todo.update({ ...newData }, { ...where })
        // const data = await Todo.update(req.body, { where: { id: req.params.id } })

        // res.status(202).send({
        //     error: false,
        //     message: 'Updated',
        //     body: req.body, // Gönderdiğim veriyi göster.
        //     result: data,
        //     new: await Todo.findByPk(req.params.id) // Güncellenmiş veriyi de göster.
        // })


        if (req.method == 'POST') {
            //UPDATE
            const data = await Todo.update(req.body, { where: { id: req.params.id } })
            res.redirect('/view')
        } else {
            // metod get ise sadece formu göster
            //FORM Görüntüle
            //mevcut datayı getir güncellemeden önce
            const data = await Todo.findByPk(req.params.id)
            res.render('todoUpdate', { todo: data.dataValues, priority: PRIORITY })
        }
    },

    delete: async (req, res) => {

        // const data = await Todo.destroy({ ...where })
        const data = await Todo.destroy({ where: { id: req.params.id } })
        // console.log(data)

        // //? 204 No Content -> Ekrana çıktı vermeyebilir.
        // res.status(204).send({
        //     error: false,
        //     message: 'Deleted',
        //     result: data
        // })

        if (data > 0) { // Silme gerçekleşti ise:
            // res.status(204).send()
            //? Sadece status çıktı ver:
            // res.sendStatus(204)
            res.redirect('/view')// template de sadece bunu ekledi başka bişi yapmadık
        } else { // Silme gerçekleşmedi ise:
            // res.status(404).send({
            //     error: true,
            //     result: data
            // })
            //? ErrorHandler'a havale edebilirim:
            res.errorStatusCode = 404
            throw new Error('Not Found.')
        }
    }
}