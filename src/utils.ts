import {ToDoItem} from './model'

export type NElement = Element | null

/**
 * Criteria for ascending date order
 * Dateless elements are pushed to the bottom
 * @param {ToDoItem} a an item
 * @param {ToDoItem} b an item
 * @return {number} values expected by comparable
 */
export function ascComparator(a: ToDoItem, b: ToDoItem): number {
    const dateA = Date.parse(a?.deadline || '')
    const dateB = Date.parse(b?.deadline || '')

    /**
     * a < b -> -1
     * a > b -> 1
     * a = b -> 0
     */

    if (dateA && dateB) {
        if (dateA < dateB) {
            return -1
        } else if (dateA > dateB) {
            return 1
        }
        return 0
    } else if (!dateA && dateB) {
        return 1
    } else if (dateA && !dateB) {
        return -1
    }
    return 0
}

/**
 * Criteria for descending date order
 * Dateless elements are pushed to the bottom.
 *
 * @param {ToDoItem} a an item
 * @param {ToDoItem} b an item
 * @return {number} values expected by comparable
 */
export function descComparator(a: ToDoItem, b: ToDoItem): number {
    const dateA = Date.parse(a?.deadline || '')
    const dateB = Date.parse(b?.deadline || '')

    if (dateA && dateB) {
        if (dateA < dateB) {
            return 1
        } else if (dateA > dateB) {
            return -1
        }
        return 0
    } else if (!dateA && dateB) {
        return 1
    } else if (dateA && !dateB) {
        return -1
    }
    return 0
}

export interface TagGroups {
    [key: string]: ToDoItem[]
}
const NOTAG = 'untagged'

export function groupByTags(items: ToDoItem[]): TagGroups {
    const groups: TagGroups = {}

    for (const item of items) {
        if (item.tags && item.tags.length < 1) {
            if (NOTAG in groups) {
                groups[NOTAG].push(item)
            } else {
                groups[NOTAG] = [item]
            }
        }
        for (const tag of item.tags || []) {
            if (tag in groups) {
                groups[tag].push(item)
            } else {
                groups[tag] = [item]
            }
        }
    }

    for (const tag in groups) {
        if (tag in Object.keys(groups)) {
            groups[tag].sort(ascComparator)
        }
    }

    return groups
}
