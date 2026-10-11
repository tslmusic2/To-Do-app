import http from 'node:http'
import path from 'node:path'
import fs from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { sendJson } from './utilities/sendResponse.js'
import { readRequestBody } from './utilities/readRequestBody.js'
import type { Task, PatchTask } from './types.ts'
import { isValidTaskList, isValidTask } from './utilities/isValidTask.ts'
import { isValidPatchTask } from './utilities/isValidPatchTask.ts'
import { isValidPostTask } from './utilities/isValidPostTask.ts'


const PORT = 8003

const __dirname = import.meta.dirname

const tasksFilePath = path.join(__dirname, 'data', 'tasks.json')

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE OPTIONS')

      if (req.method === 'OPTIONS') {
      res.statusCode = 204
      return res.end()
      }

console.log(req.method, req.url)

      if (req.url === '/api/tasks' && req.method === 'GET') {

            try {
                  
                  const tasksFile = await fs.readFile(tasksFilePath, 'utf8')
                  const parsedTasksFile: unknown = JSON.parse(tasksFile)

                  if (!isValidTaskList(parsedTasksFile)) {
                        return sendJson(res, 500, {message: 'Invalid task data'})
                  } 
                        return sendJson(res, 200, parsedTasksFile)
                  

            } catch(err) {
                  console.log(err)
                  return sendJson(res, 500, {error: 'There was an issue with the server'})
            }

      }


      if (req.url === '/api/tasks' && req.method === 'POST') {

            try {

                  const parsedBody = await readRequestBody(req)
                  const validationResult = isValidPostTask(parsedBody)
                  if(!validationResult.valid) {
                        return sendJson(res, 400, {message: validationResult.message})
                  }


                  const {task, priority} = validationResult.data



                  const tasksListFile = await fs.readFile(tasksFilePath, 'utf8')
                  const parsedTasksListFile: unknown = JSON.parse(tasksListFile)
                  if (!isValidTaskList(parsedTasksListFile)) {
                        return sendJson(res, 500, {message: 'Invalid task data'})
                  }

                  const newID = parsedTasksListFile.length > 0 ? Math.max(...parsedTasksListFile.map(task => task.id)) + 1 : 1

                  const newIdObj: Task = {
                        id: newID,
                        task: task,
                        completed: false,
                        priority: priority
                  }


                  parsedTasksListFile.push(newIdObj)

                  await fs.writeFile(tasksFilePath, JSON.stringify(parsedTasksListFile, null, 2), 'utf8')

                  return sendJson(res, 201, {message: 'Your task was succesfully added', task: newIdObj})


            } catch(err) {
                  console.log(err)
                  return sendJson(res, 500, {error: 'There was an issue with the server'})
            }


      }


      if(req.url && req.url.startsWith('/api/tasks/') && req.method === 'PATCH') {

            try {
                  const parsedReqBody: unknown = await readRequestBody(req)

                  const validationResult = isValidPatchTask(parsedReqBody)
                  if (!validationResult.valid) {
                        return sendJson(res, 400, {message: validationResult.message})
                  }

                  const id = Number(req.url.split('/').pop())
                  if (!Number.isInteger(id) || id < 1) {
                        return sendJson(res, 400, {message: 'id must be a number greater than 0'})
                  }

                  const tasksDataFile = await fs.readFile(tasksFilePath, 'utf8')
                  const parsedtasksDataFile: unknown = JSON.parse(tasksDataFile)

                  if (!isValidTaskList(parsedtasksDataFile)) {
                        return sendJson(res, 500, {message: 'Invalid task data'})
                  }

                  const patchTask = parsedtasksDataFile.find(task => task.id === id)         
                  if (!patchTask) {
                        return sendJson(res, 404, {message: 'task not found'})
                  }

                  Object.assign(patchTask, validationResult.data)


                  await fs.writeFile(tasksFilePath, JSON.stringify(parsedtasksDataFile, null, 2), 'utf8')

                  return sendJson(res, 200, {message: 'Your data update was successful'})

            } catch(err) {
                  console.log(err) 
                  return sendJson(res, 500, {message: 'There was an issue with the server'})
            }

      }
      


      if (req.url && req.url.startsWith('/api/tasks') && req.method === 'DELETE') {


            try {

                  const id = Number(req.url.split('/').pop())
                  if (!Number.isInteger(id) || id < 1) {
                        return sendJson(res, 400, {message: 'Invalid task id'})
                  }

                  const tasksFile = await fs.readFile(tasksFilePath, 'utf8')
                  const parsedTasksFile: unknown = JSON.parse(tasksFile)
                  if (!isValidTaskList(parsedTasksFile)) {
                        return sendJson(res, 500, {message: 'Invalid task data'})
                  }

                  const updatedparsedTaskFile = parsedTasksFile.filter(task => task.id !== id)
                  if (updatedparsedTaskFile.length === parsedTasksFile.length) {
                        return sendJson(res, 404, {message: 'task id couldnt be found'})
                  }

                  await fs.writeFile(tasksFilePath, JSON.stringify(updatedparsedTaskFile, null, 2), 'utf8')

                  return sendJson(res, 200, {message:'The task was deleted successfully'})
            
            } catch(err) {
                  console.log(err) 
                  sendJson(res, 500, {error: 'Unable to delete item'})
            }

      }



      //      --APIs to build--
      //GET   /api/tasks  add query param capabilities?


})

server.listen(PORT, () => console.log(`Connected on port: ${PORT}`))