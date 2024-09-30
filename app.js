const express = require('express')
const path = require('path')
const app = express()
const PORT = 5000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static("public"))


const getTasks = () => {
    const data = fs.readFileSync('./data/data.json', 'utf8');
    return JSON.parse(data);
}

const saveTasks = (tasks) => {
    fs.writeFileSync('./data/data.json', JSON.stringify(tasks, null, 2));
};

//POST: Create a new task
app.post('/tasks', (req, res) => {
    const tasks = getTasks();
    const newTasks = {
        id: tasks.length+1,
        name: req.body.name,
        date: req.body.date,
        description: req.body.description
    };
    tasks.push(newTasks);
    saveTasks(tasks);
    res.redirect('/');
});

//GET: Shows a single task (for editing)
app.get('/tasks/:id/edit', (req,res) => {
    const tasks = getTasks();
    const task = tasks.find(task => task.id == req.params.id);
    res.render('tasks', { task });
});

//PUT: Update a task
app.post('/tasks/:id', (req, res) => {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id == req.params.id);
    tasks[taskIndex].description = req.body.description;
    tasks[taskIndex].name = req.body.name;
    tasks[taskIndex].date = req.body.date;
    saveTasks(tasks);
    res.redirect('/');
});

//DELETE: Delete a task
app.post('/tasks/:id/delete', (req,res) => {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.id != req.params.id);
    saveTasks(tasks);
    res.redirect('/');
});

app.get('/', function(req,res){
    let tasks = getTasks();
    res.render('index', { tasks })
})

app.get('/admin', function(req,res){
    let tasks = getTasks();
    res.render('admin', { tasks });
})

app.listen(PORT, ()=> {
    console.log(`listening on port ${PORT}`)
})