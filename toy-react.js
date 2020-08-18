// html原生的标签，用js内部方法创建
class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type);
    }

    setAttribute(name, value) {
        this.root.setAttribute(name, value)
    }

    appendChild(component) {
        this.root.appendChild(component.root);
    }
}

// 用来显示元素的文本
class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);
    }
}

// 自定义组件要继承的父类
export class Component {
    constructor() {
        this.props = Object.create(null);
        this.children = [];
        this._root = null;
    }

    setAttribute(name, value) {
        this.props[name] = value;
    }
    appendChild(component){
        this.children.push(component);
    }
    get root(){
        if (!this._root) {
            this._root = this.render().root;
        }
        return this._root;
    }
}

// 根据不同元素类型创建元素树
export function createElement(type, attributes, ...children) {
    let e;
    if (typeof type === "string") {
        // html原生的标签
        e = new ElementWrapper(type);
    } else {
        // 自定义的类
        e = new type;
    }
    // 设置参数
    for (let p in attributes) {
        e.setAttribute(p, attributes[p]);
    }
    let insertChildren = (children) => {
        for (let child of children) {
            if (typeof child === "string") {
                // 元素的文本
                child = new TextWrapper(child);
            }
            if (typeof child === "object" && child instanceof Array) {
                // 自定义的元素
                insertChildren(child);
            } else {
                // 普通html元素，小写那种
                e.appendChild(child)
            }
        }
    }
    insertChildren(children)

    return e;
}

// 渲染内容
export function render(component, parentElement) {
    parentElement.appendChild(component.root)
}