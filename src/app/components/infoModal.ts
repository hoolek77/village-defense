import { renderPopup } from './popup'
import { createElement } from '../utils'

export class InfoModal {
  private openInfoBtn: HTMLButtonElement

  constructor() {
    this.openInfoBtn = document.querySelector(
      '#info-button'
    ) as HTMLButtonElement

    this._init()
  }

  private _init() {
    this.openInfoBtn?.addEventListener('click', this.render.bind(this))
  }

  private render() {
    const wrapper = createElement({ type: 'div' })
    const infoContent = createElement({ type: 'div' })
    const gameDesc = createElement({
      type: 'p',
      classes: ['info__desc'],
      content: `
      Are you ready to conquer the world? Today you can follow in the footsteps of history's greatest commanders.
      
      Your task in this game is to develop your own village, from a small settlement to a large fortified stronghold, to create a strong army that will stand up to invaders. Face your opponents and protect your village! 
      `,
    })
    const authorsHeader = createElement({
      type: 'h2',
      classes: ['authors__header'],
      content: 'Authors',
    })
    const authorList = createElement({
      type: 'ul',
      classes: ['authors__list'],
      innerHTML: `
          <li class="author">
            <div class="author__container">
              <div class="author__front">
                  <div class="author__content">Piotr Dybowski</div>
              </div>
              <div class="author__back">
                  <div class="author__content">
                    <i class="fas fa-user-tie author__icon"></i>
                    <span class="author__position">Mentor<br />Client</span>
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
                      <i class="fas fa-hiking author__icon"></i>
                      <span class="author__position">Product<br />Owner</span>
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
                      <i class="fas fa-user-ninja author__icon"></i>
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
                      <i class="fas fa-user-secret author__icon"></i>
                      <span class="author__position">Tech<br />Lead</span>
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
                      <i class="fas fa-user-cog author__icon"></i>
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
                    <i class="fas fa-user-cog author__icon"></i>
                    <span class="author__position">Developer</span>
                  </div>
              </div>
            </div>
          </li>
        `,
    })

    const authorListMobile = createElement({
      type: 'ul',
      classes: ['authors__list--mobile'],
      innerHTML: `
          <li class="author--mobile">
            Piotr Dybowski - Mentor / Client
          <li class="author--mobile">
            Ireneusz Bednorz - Product Owner
          </li>
          <li class="author--mobile">
              Szymon Kin - Dev Menager
          </li>
          <li class="author--mobile">
              Bartosz Białecki - Tech Lead
          </li>
          <li class="author--mobile">
              Aleksandra Jankowska - Developer
          </li>
          <li class="author--mobile">
            Jakub Góra - Developer
          </li>
        `,
    })

    wrapper.append(infoContent)
    infoContent.append(gameDesc, authorsHeader, authorList, authorListMobile)

    renderPopup({
      headerText: 'Info',
      popupContentHTML: wrapper,
      closeBtnText: 'Close',
    })
  }
}
