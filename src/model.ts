const ra = '2123690'
const host = 'https://todo-server-spa-ozyq2qhxqq-rj.a.run.app/api'

/**
 * Domain Object and Data Transfer Object.
 */
export interface ToDoItem {
    id: number
    description: string
    tags?: string[]
    deadline?: string
}

/**
 * A DAO for ToDoItem's.
 */
export class ToDoItemDAO {
    /**
     * Validate an item.
     *
     * @param {ToDoItem} item the item
     * @return {boolean} true if the item is valid, false otherwise
     */
    private isItemValid(item: ToDoItem) {
        return item.description.length > 0
    }

    /**
     * List all items.
     *
     * @return {Promise<ToDoItem[]>} the items as a Promise
     */
    async listAll(): Promise<ToDoItem[]> {
        try {
            const response = await fetch(`${host}/${ra}/list`)

            if (response.ok) {
                return (await response.json()).items as ToDoItem[]
            }
            console.error('Server status: ' +
                JSON.stringify(await response.json()))
            throw new Error('Server-side error. Failed to list')
        } catch (error) {
            console.error('Failed to list elements')
            throw error
        }
    }

    /**
     * Insert an item.
     *
     * @param {ToDoItem} item the item
     * @return {boolean} a promise for true, if the operation
     *  was successfull, false otherwise
     */
    async insert(item: ToDoItem): Promise<void> {
        try {
            const response = await fetch(`${host}/${ra}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
            })
            if (response.ok) {
                return;
            }
            throw new Error("Failed to insert item. " + JSON.stringify(await response.json()))
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    /**
     * Update an item.
     *
     * @param {ToDoItem} item the item
     * @return {Promise<boolean>} true if success, false otherwise
     */
    async update(item: ToDoItem): Promise<void> {
        try {
            const response = await fetch(`${host}/${ra}/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
            })
            if (response.ok) {
                return;
            }
            throw new Error('Failed to update element. ' + JSON.stringify(await response.json()))
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    /**
     * Remove an item by id.
     *
     * @param {string} id the item id
     * @return {Promise<boolean>} true if success, false otherwise
     */
    async removeById(id: string): Promise<void> {
        try {
            const response = await fetch(`${host}/${ra}/remove/${id}`)
            if (response.ok) {
                return;
            }

            throw new Error('Failed to remove element. ' + JSON.stringify(await response.json()))
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    /**
     * Find an item by id.
     *
     * @param {string} id the id
     * @return {ToDoItem} the ToDoItem
     */
    async findById(id: string): Promise<ToDoItem> {
        try {
            const response = await fetch(`${host}/${ra}/item/${id}`)
            const jsonResp = await response.json()

            if (response.ok) {
                return jsonResp.item as ToDoItem
            }
            throw new Error('Server-side error. Status: ' +
                JSON.stringify(jsonResp))
        } catch (error) {
            console.error('Failed to get element by id')

            throw error
        }
    }
}
