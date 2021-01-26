import {renderPopup} from '../popup'

const btn = document.querySelector('#info-button')

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

        const footer = this.createElementt('footer', '', 'footer')
        const footerHeader = this.createElementt('h2', '', 'footer__header', 'Authors')
        const authorList = this.createElementt('ul', '', 'authors__list',
        `
            <li class="author">
            <div class="author__container">
            <div class="author__front">
                <div class="author__content">Piotr Dybowski</div>
            </div>
            <div class="author__back">
                <div class="author__content">
                <span class="author__position">Mentor<br />Client</span>
                </div>
            </div>
            </div>
        </li>
        <li class="author">
            <div class="author__container">
            <div class="author__front">
                <div class="author__content">Szymon Kin</div>
            </div>
            <div class="author__back">
                <div class="author__content">
                <i class="fas fa-user-secret author__icon"></i>
                <span class="author__position">Dev<br />Manager</span>
                </div>
            </div>
            </div>
        </li>
        <li class="author">
            <div class="author__container">
            <div class="author__front">
                <div class="author__content">Bartosz Białecki</div>
            </div>
            <div class="author__back">
                <div class="author__content">
                <span class="author__position"
                    >Tech<br />Lead</span
                >
                </div>
            </div>
            </div>
        </li>
        <li class="author">
            <div class="author__container">
            <div class="author__front">
                <div class="author__content">Ireneusz Bednorz</div>
            </div>
            <div class="author__back">
                <div class="author__content">
                <span class="author__position">Product<br />Owner</span>
                </div>
            </div>
            </div>
        </li>
        <li class="author">
            <div class="author__container">
            <div class="author__front">
                <div class="author__content">Aleksandra Jankowska</div>
            </div>
            <div class="author__back">
                <div class="author__content">
                <span class="author__position">Developer</span>
                </div>
            </div>
            </div>
        </li>
        <li class="author">
            <div class="author__container">
            <div class="author__front">
                <div class="author__content">Jakub Góra</div>
            </div>
            <div class="author__back">
                <div class="author__content">
                <span class="author__position">Developer</span>
                </div>
            </div>
            </div>
        </li>
        </div>
        `)


        footer.appendChild(authorList)



        wrapper.append(header, infoContent,footerHeader,footer)
        infoContent.appendChild(gameDesc)
        renderPopup(wrapper, 'X');
    }

    createElementt(typeElement:string, idElement?:string, classesElement?:string, textElement?:string){
        const infoItem = document.createElement(typeElement)
        if(idElement){
            infoItem.id = idElement
        }
        if(classesElement){
            infoItem.className = classesElement
        }
        if(textElement){
            infoItem.innerHTML = textElement
        }

        return infoItem
    }
}

