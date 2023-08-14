import express from "express";
import { engine } from "express-handlebars";
import * as path from "path"
import { ToDoItem, ToDoItemDAO } from "./model";
import { ascComparator, descComparator, groupByTags } from "./utils";
import e from "express";

const app = express()

const STATIC_DIR = path.join(__dirname, '..', 'static')

app.use('/static', express.static(STATIC_DIR));

app.engine('handlebars', engine({
    helpers: {
        formatDate: (date: string) => (date) ? date.substring(0,16) : '',
        fillDate: (dateStr: string) => (dateStr) ? Intl.DateTimeFormat("sv-SE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",

        }).format(new Date(Date.parse(dateStr))): '',
        equals: (a: string, b: string) => a == b
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, '..', 'views'));

const dao = new ToDoItemDAO()

class ToDoItemMapper {
    static fromJson(json: any): ToDoItem {
        if ('description' in json) {
            const item = {
                id: 0,
                description: json.description
            } as ToDoItem
            if ('id' in json) {
                item.id = parseInt(json.id)
            }
            if ('tags' in json) {
                item.tags = (json.tags as string).split(',').map( el => el.trim())
            }
            if ('deadline' in json) {
                item.deadline = json.deadline
            }

            return item
        }
        throw new Error('Invalid item format')
    }
}

app.get('/', (req, res) => {
    res.redirect('/newest')
})

app.get('/newest', async (req, res, next) => {
    try {
        const items = await dao.listAll()

        items.sort(ascComparator)
        res.render('newest', {
            items: items
        })
    } catch(error) {
        next(error)
    }
    
})

app.get('/oldest', async (req, res, next) => {
    try {
        const items = await dao.listAll()

        items.sort(descComparator)

        res.render('oldest', {
            items: items
        })
    } catch(error) {
        next(error)
    }
    
})

app.get('/tags', async (req, res, next) => {
    try {
        const groupedItems = groupByTags(await dao.listAll())

        res.render('tags', {
            tags: Object.keys(groupedItems).sort(),
            items: groupedItems
        })
    } catch(error) {
        next(error)
    }
})

app.get('/add', (req, res) => {
    res.render('add')
})

app.post('/add', express.urlencoded({extended: true}), async (req, res, next) => {
    try {
        await dao.insert(ToDoItemMapper.fromJson(req.body))
        res.render('status', {
            code: 'item_add_success'
        })
    } catch(error) {
        next(error)
    }
})

app.get('/edit/:id', async (req, res, next) => {
    try {
        const item = await dao.findById(req.params.id)    

        res.render('add', {
            item: item,
            edit: true
        })    
    } catch(error) {
        next(error)
    }
    
})

app.post('/edit', express.urlencoded({extended: true}), async (req, res, next) => {
    try {
        await dao.update(ToDoItemMapper.fromJson(req.body))
        res.render('status', {
            code: 'item_update_success'
        })
    } catch(error) {
        next(error)
    }
})

app.post('/remove/:id', async (req, res, next) => {
    try {
        await dao.removeById(req.params.id)
        res.render('status', {
            code: 'item_remove_success'
        })    
    } catch(error) {
        next(error)
    }
    
})

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err)    
    res.status(500).render('status', {
        code: 'exception'
    })
})

app.listen(3000, () => {
    console.log(`ToDo! server listening on port 3000!`);
})