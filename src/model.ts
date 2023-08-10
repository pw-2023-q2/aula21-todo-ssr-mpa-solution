const ra = ""
const host = "https://todo-server-spa-ozyq2qhxqq-rj.a.run.app/api"

export class ToDoItem {
    id: number
    description: string
    tags?: string[]
    deadline?: string

    constructor(description: string) {
        this.id = 0
        this.description = description
        this.tags = []
        this.deadline = ""
    }
}


export class ToDoItemDAO {

    private isItemValid(item: ToDoItem) {
        return item.description.length > 0
    }
    
    async listAll(): Promise<ToDoItem[]> {
        try {
            const response = await fetch(`${host}/${ra}/list`)

            if (response.ok) {
                return (await response.json()).items as ToDoItem[]
            }
            console.error("Server status: " + JSON.stringify(await response.json()))
            throw new Error("Server-side error. Failed to list")
        } catch (error) {
            console.error("Failed to list elements")
            throw error
        }
    }

    async insert(item: ToDoItem): Promise<boolean> {
        try {
            const response = await fetch(`${host}/${ra}/add`, {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(item)
            })
            if (response.ok) {
                return true
            } 
            console.error("Server-side error. Failed to insert.")
            console.error("Server status: " + JSON.stringify(await response.json()))

            return false
        } catch(error) {
            console.error("Failed to insert element")

            throw error
        }
    }

    async update(item: ToDoItem) {
        try {
            const response = await fetch(`${host}/${ra}/update`, {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(item)
            })
            if (response.ok) {
                return true
            } 
            console.error("Server-side error. Failed to update.")
            console.error("Server status: " + JSON.stringify(await response.json()))

            return false
        } catch(error) {
            console.error("Failed to update element")

            throw error
        }
    }

    async removeById(id: string): Promise<boolean> {
        try {
            const response = await fetch(`${host}/${ra}/remove/${id}`)
            if (response.ok) {
                return true
            } 
            console.error("Server-side error. Failed to remove.")
            console.error("Server status: " + JSON.stringify(await response.json()))

            return false
        } catch(error) {
            console.error("Failed to remove element")

            throw error
        }
    }

    async findById(id: string) {
        try {
            const response = await fetch(`${host}/${ra}/item/${id}`)
            const jsonResp = await response.json()

            if (response.ok) {
                return jsonResp.item as ToDoItem
            }
            throw Error("Server-side error. Status: " + JSON.stringify(jsonResp))                
        } catch(error) {
            console.error("Failed to get element by id")

            throw error
        }
    }
}