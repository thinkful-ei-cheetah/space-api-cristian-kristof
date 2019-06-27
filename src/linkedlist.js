class _Node {
  constructor(val, next) {
    this.val = val
    this.next = next
  }
}

class LinkedList {
  constructor() {
    this.head = null
  }

  insertFirst(item) {
    this.head = new _Node(item, this.head)
  }

  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item)
    } else {
      let tempNode = this.head
      while (tempNode.next !== null) {
        tempNode = tempNode.next
      }
      tempNode.next = new _Node(item, null)
    }
  }

  insertBefore(newItem, beforeItem) {
    if (this.head === null) {
      this.insertFirst(newItem)
      return
    }

    let currNode = this.head
    let prevNode = this.head

    while (currNode !== null && currNode.val !== beforeItem) {
      prevNode = currNode
      currNode = currNode.next
    }

    if (currNode === null) {
      this.insertLast(newItem)
      return
    }

    const tempNode = new _Node(newItem, currNode)

    prevNode.next = tempNode
  }

  insertAfter(newItem, afterItem) {
    if (this.head === null) {
      this.insertFirst(newItem)
      return
    }

    let currNode = this.find(afterItem)

    if (currNode === null) {
      this.insertLast(newItem)
      return
    }

    const tempNode = new _Node(newItem, currNode.next)

    currNode.next = tempNode
  }

  insertAt(item, position) {
    if (this.head === null) {
      this.insertFirst(item)
      return
    }

    let currNode = this.head
    let currPosition = 1

    while (currPosition < position - 1) {
      currNode = currNode.next
      currPosition++
    }

    const tempNode = new _Node(item, currNode.next)

    currNode.next = tempNode
  }

  remove(item) {
    if (!this.head) {
      return null
    }

    if (this.head.val === item) {
      this.head = this.head.next
      return
    }

    let currNode = this.head
    let prevNode = this.head

    while (currNode !== null && currNode.val !== item) {
      prevNode = currNode
      currNode = currNode.next
    }

    if (currNode === null) {
      console.log('item not found')
      return
    }
    prevNode.next = currNode.next
  }

  find(item) {
    let currNode = this.head

    if (!this.head) {
      return null
    }

    while (currNode.val !== item) {
      if (currNode.next === null) {
        return null
      } else {
        currNode = currNode.next
      }
    }
    return currNode
  }

  getFirst() {
    let firstNode = this.head
    return firstNode.val
  }

  getNext() {
    let firstNode = this.head
    let nextNode = firstNode.next
    return nextNode.val
  }

  moveTo(m) {
    let currNode = this.head
    let firstNode = this.head
    let currPosition = 1

    while (currPosition <= m && currNode.next !== null) {
      currNode = currNode.next
      currPosition++
    }
    
    const tempNode = new _Node(firstNode.val, currNode.next)

    currNode.next = tempNode
    this.head = firstNode.next
  }

}

function test() {
  const test = new LinkedList()

  test.insertLast({
    original: 'hola',
    translation: 'hello'
  })
  test.insertLast({
    original: 'carro',
    translation: 'car'
  })
  test.insertLast({
    original: 'perro',
    translation: 'dog'
  })
  test.insertLast({
    original: 'casa',
    translation: 'house'
  })
  test.insertLast({
    original: 'arbol',
    translation: 'tree'
  })

  test.moveTo(4)

  return test
}


function display(LL) {
  let output = ''

  let currNode = LL.head

  while (currNode !== null) {
    output += currNode.val

    if (currNode.next !== null) {
      output += ' -> '
    }

    currNode = currNode.next
  }

  console.log(output)
}

// display(test())
// console.log(test().getFirst())

module.exports = LinkedList