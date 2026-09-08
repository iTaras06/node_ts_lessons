// //Успадкування, поліморфізм
// abstract class Transport {
//   private model;
//   constructor(model: string) {
//     this.model = model;
//   }
//   abstract move(): void;
// }
// class Bus extends Transport {
//   constructor(model: string) {
//     super(model);
//   }

//   move(): void {
//     console.log("Bus move");
//   }
// }

// class Car extends Transport {
//   constructor(model: string) {
//     super(model);
//   }

//   move(): void {
//     console.log("Car move");
//   }
// }


// function drive(tr:Transport):void {
//     tr.move()
// }

// drive(new Car("mazda"))
// drive(new Bus("my bus")).
 
// enum Roles {
//   ADMIN=1,
//   MANAGER,
//   USER,
// }

// const role: Roles = Roles.MANAGER;

// console.log(Roles[role]);
//TODO: function
// let a:any = "hello"
// a = 10
// let a2:unknown 




// import * as fs from "node:fs/promises"
// import * as readline from "node:readline/promises"
// import path from "node:path"
// import {stdout as output, stdin as input} from "node:process"

// const FILE_TO_PATH = path.join('logs', 'logs.txt')


// async function getContent():Promise<string>
// {
//     const rl = readline.createInterface({input, output})
//     try{
//         const content:string = await rl.question("Enter your content: ")
//         return content
//     }catch(error){
//         console.log(`no data ${error}`)
//         return ''
//     }
//     finally{
//         rl.close()
//     }
// }

// async function writeToFile(filePath:string, content:string):Promise<void>{
//     try{
//         await fs.appendFile(filePath, content+'\n', 'utf-8')
//         console.log("Файл успешно сохраненно")
//     }
//     catch(error)
//     {
//         console.log("Файл не сохранен")
//     }
// }


// getContent().then(data=>{
//     writeToFile(FILE_TO_PATH, data)
// })

// stdout.write("Enter content: ")
// stdin.on('data', (data:Buffer)=>{
//     console.log("Байти", data)
//     const content:string = data.toString('utf-8')
//     console.log("Контент", content)
//     writeToFile(FILE_TO_PATH, content).then(_=>{
//         process.exit()
//     })
// })








import path from "node:path"
import fs from "node:fs/promises"
import { existsSync, watch, constants } from "node:fs"
import FileWorker from "./FileWorker.js"

const FILE_TO_PATH = path.join('logs','logs.txt')
 
FileWorker.path = FILE_TO_PATH;
let content:string | undefined = await FileWorker.getContent()
await FileWorker.writeToFile(FILE_TO_PATH, content)
content = (await FileWorker.readFile(FILE_TO_PATH))?.toString('utf-8')
console.log(`Content from file:\n ${content}`)


await fsMethods()

async function fsMethods() {
    const dir = path.dirname(FILE_TO_PATH)              
    const copyPath = path.join(dir, 'logs_copy.txt')
    const renamedPath = path.join(dir, 'logs_renamed.txt')
    const tempDir = path.join(dir, 'temp_dir')

    //1) fs.mkdir()-создать папку, если указать {recursive:true} - создаст вложенные папки
    const nestedDir = path.join(dir, 'nested', 'deep', 'folder')
    await fs.mkdir(nestedDir, { recursive: true })
    console.log(`Папка создана (со всеми вложенными): ${nestedDir}`)
    console.log(`Существует папка: ${existsSync(nestedDir)}`)

    //2) fs.existsSync()-проверить существование папки или файла, возвращает true или false
    console.log(`Файл ${FILE_TO_PATH} существует: ${existsSync(FILE_TO_PATH)}`)
    console.log(`Файл incorrect.txt существует: ${existsSync('incorrect.txt')}`)

    //3) fs.access()-проверить права доступа к файлу, если нет прав - выбросит ошибку
    try {
        await fs.access(FILE_TO_PATH, constants.R_OK | constants.W_OK)
        console.log(`Есть права на чтение и запись: ${FILE_TO_PATH}`)
    } catch (error) {
        console.log(`Нет доступа: ${error}`)
    }

    //4) fs.stat-получить информацию о файле или папке
    const stats = await fs.stat(FILE_TO_PATH)
    console.log(`Размер файла: ${stats.size} байт`)
    console.log(`Дата изменения: ${stats.mtime}`)
    console.log(`Это файл: ${stats.isFile()}, это папка: ${stats.isDirectory()}`)

    //5) fs.copyFile-копировать файл
    await fs.copyFile(FILE_TO_PATH, copyPath)
    console.log(`Файл скопирован: ${FILE_TO_PATH} -> ${copyPath}`)

    //6) fs.rename-переименовать/переместить файл или папку
    await fs.rename(copyPath, renamedPath)
    console.log(`Файл переименован: ${copyPath} -> ${renamedPath}`)

    //7) fs.readdir-получить список файлов и папок в директории
    const files = await fs.readdir(dir)
    console.log(`Содержимое папки "${dir}":`, files)

    //8) fs.watch-следить за изменениями в файле или папке, при изменении вызывается callback
    await new Promise<void>((resolve) => {
        const watcher = watch(dir, (eventType, filename) => {
            console.log(`Событие "${eventType}" для файла "${filename}"`)
            watcher.close()
            resolve()
        })
        fs.appendFile(FILE_TO_PATH, 'watch trigger\n', 'utf-8')
    })

    //9) fs.unlink-удалить файл
    await fs.unlink(renamedPath)
    console.log(`Файл удалён: ${renamedPath}`)

    //10) fs.rm-удалить файл или папку вместе с содержимым, если указать {recursive:true}, force:true - удалит без подтверждения
    await fs.mkdir(tempDir, { recursive: true })
    await fs.writeFile(path.join(tempDir, 'inner.txt'), 'temp content')
    await fs.rm(tempDir, { recursive: true, force: true })
    console.log(`Папка ${tempDir} удалена\n`)
}