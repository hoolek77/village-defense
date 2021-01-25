import {renderPopup} from '../popup'

const btn = document.querySelector('#info')

export default class infoContentProvider {
    constructor(){
        btn?.addEventListener('click', this.render.bind(this));
    }

    render() {
        const wrapper = this.createElementt('div')
        const header = this.createElementt('h1', '', 'header', 'Info');
        const infoContent = this.createElementt('div')
        const gameDesc = this.createElementt('p', '', 'info__desc', 
        `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu faucibus urna. Mauris eu lorem ac felis rhoncus tempor ut eget felis. In ullamcorper fringilla lorem. Nam blandit, sapien sed venenatis lobortis, lacus ligula pellentesque libero, a feugiat velit neque sit amet turpis. Integer tempor elementum lectus quis tincidunt. Cras egestas orci sed nisi tempus ultrices. Maecenas enim arcu, volutpat non nunc nec, consequat faucibus lorem.
        `
        )


        wrapper.appendChild(header)
            .appendChild(infoContent)
            .appendChild(gameDesc)
        renderPopup(wrapper, 'x');
    }

    createElementt(typeElement:string, idElement?:string, classesElement?:string, textElement?:string){
        const infoItem = document.createElement(typeElement)
        infoItem.id = idElement?idElement:''
        if(classesElement){
            infoItem.className = classesElement
        }
        if(textElement){
            infoItem.textContent = textElement
        }

        return infoItem
    }
}

