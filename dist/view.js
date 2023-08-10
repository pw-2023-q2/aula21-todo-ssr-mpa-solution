"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var View;
(function (View) {
    // import ToDoItem = Model.ToDoItem
    function buildItemList(items, container) {
        for (const item of items) {
            const template = document.getElementById('list-item-template');
            const clone = template.content.cloneNode(true);
            const listItem = clone.querySelector('.list-group-item');
            const description = clone.querySelector('.list-item-desc');
            const badgeContainer = clone.querySelector('.badge-container');
            const deadline = clone.querySelector('.list-item-deadline');
            // TODO: identify the checkboxes
            if (description) {
                description.textContent = item.description;
            }
            if (listItem) {
                container.appendChild(listItem);
            }
        }
    }
    View.buildItemList = buildItemList;
})(View || (View = {}));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const dao = new Model.ToDoItemDao();
        const items = yield dao.listAll();
        const container = document.getElementById('newest-content');
        if (container) {
            View.buildItemList(items, container);
        }
        // console.log(items)
    });
}
main().then();
