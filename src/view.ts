import { ToDoItem, ToDoItemDAO } from "./model"

namespace View {
    // import ToDoItem = Model.ToDoItem

    export function buildItemList(items: ToDoItem[], container: HTMLElement) {
        for (const item of items) {
            const template = document.getElementById('list-item-template') as HTMLTemplateElement
            const clone = template.content.cloneNode(true) as DocumentFragment

            const listItem = clone.querySelector('.list-group-item')
            const description = clone.querySelector('.list-item-desc')
            const badgeContainer = clone.querySelector('.badge-container')
            const deadline = clone.querySelector('.list-item-deadline')

            // TODO: identify the checkboxes

            if (description) {
                description.textContent = item.description
            }

            if (listItem) {
                container.appendChild(listItem)
            }
        }
    }
}

async function main() {
    const dao = new ToDoItemDAO()

    const items = await dao.listAll()
    const container = document.getElementById('newest-content')

    if (container) {
        View.buildItemList(items, container)
    }   

    // console.log(items)
}

main().then()