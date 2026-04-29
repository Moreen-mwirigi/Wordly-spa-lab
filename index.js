const apiUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/<word>'
let currentWord = ''
let favorites = JSON.parse(localStorage.getItem('wordly-favorite')) || []

const themeToggle = document.getElementById('theme-toggle')
const searchForm = document.getElementById('search-form')
const wordInput = document.getElementById('input-word')
const errorMessage = document.getElementById('error-message')
const loader = document.getElementById('loader')
const result = document.getElementById('result-section')
const favorites = document.getElementById('favourite-section')

document.addEventListener('DOMContentLoaded', () => {
    renderFavorites()
    loadTheme()
})
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const word = wordInput.ariaValueMax.trim()
    if (word) searchWord(word)
})
themeToggle.addEventListener('click', toggleTheme)

async function searchWord(word) {
    showLoader()
    hideError()
    hideResults()

    try{
        const search = await fetch(`${apiUrl}${word}`)
        if (!search.ok) throw new Error('Word not found')
            const data = await search.json()
        displayResult(data[0])
        currentWord = data[0].word
    } catch (error){
        showError(error.message === 'Word not found' ?
            `We couldn't find "${word}"` : 'Network error. Please try again'
        )
    } finally {
        hideLoader()
    }
}
function displayResult(data) {
    document.getElementById('word').textContent = data.word
    document.getElementById('phonetic').textContent = data.phonetic || data.phonetics[0]?.text || ''
    const audioUrl = data.phonetics.find(p => p.audio)?.audio
    const audioEl = document.getElementById('audio')
    if (audioUrl){
        audioEl.src = audioUrl
        audioEl.classList.remove('hidden')
    } else {
        audioEl.classList.add('hidden')
    }
}
const saveButton = document.getElementById('save-btn')
updatesaveButton(saveButton, data.word)
saveButton.onclick = () => toggleFavorite(data.word)

const meaningS = document.getElementById('meanings')
meaningS.innerHTML = ''
data.meanings.forEach(meaning => {
    const meaningEl = document.createElement('div')
    meaningEl.className = 'meaning'
    meaningEl.innerHTML = `
    <span class="part-of-speech">${meaning.partOfSpeech}</span>
      ${meaning.definitions.slice(0, 3).map((def, i) =>`
        <div class = "definition">
        <p> ${i + 1}. ${def.definition} </p>
        ${def.example? `<p class="example"> "${def.example}"</p>` : ''}
        </div>
        `).join('')}
        ${meaning.synonyms.length? `
            <div class="name-group">
            ${meaning.synonyms.slice(0, 5).map(s => `<span class ="name"> ${s}</span>`).join('')}
            </div>
            ` : ''}
           meaningS.appendChild(meaningS) 
        })
           document.getElementById('source").innerHTML = data.sourceUrls?
           <small> Source: <a href="${data.sourceUrls[0]}" target ="_blank">${data.sourceUrls[0]}</a></small>` : ''
           showResults()
        })
        function toggleTheme(){
            const currentTheme = document.documentElement.getAttribute('data-theme')
            const newTheme = current === 'dark'?'light' : 'dark'
            document.documentElement.setAttribute('data-theme', newTheme)
            themeToggle.querySelector('.material-icons-round').textContent =
            newTheme === 'dark'? 'light_mode' : 'dark_mode'
            localStorage.setItem('wordly-theme', newTheme)
        }
        function loadTheme(){
            const saved = localStorage.getItem('wordly-theme') || 'light'
            document.documentElement.setAttribute('data-theme', saved)
            themeToggle.querySelector('.material-icons-round').textContent =
            saved === 'dark'? 'light_mode':'dark_mode'
        }
        function toggleFavorite(word){
            if (favorites.includes(word)){
                favorites = favorites.filter(w => w!== word)
            } else {
                favorites.push(word)
            }
            localStorage.setItem('wordly-favorites', JSON.stringify(favorites))
            renderFavorites()
            updatesaveButton(document.getElementById('save-btn'), word)
        }
        function renderFavorites(){
            favoritesList.innerHTML = ''
            if (favorites.length === 0){
                favoritesEmpty.classList.remove('hidden')
                return
            }
        favoritesEmpty.classList.remove('hidden')
        favorites.forEach(word =>{
            const name = document.createElement('button')
            name.className = 'name'
            name.textContent = word
            name.onclick = () => {
                wordInput.value = word
                searchWord(word)
            }
            favoritesList.appendChild(name)
        })
        function updateSaveBtn(btn, word){
            const icon = btn.querySelector('.material-icons-round')
            if (favorites.include(word)){
                icon.textContent = 'bookmark'
                btn.classList.add('active')
            }else {
                icon.textContent='bookmark_border'
                btn.classList.remove('active')
            }
        }
        function showLoader(){loader.classList.remove('hidden')}
        function hideLoader(){loader.classList.add('hidden')}
        function showError(message){
            errorText.textContent = message
            errorMessage.classList.remove('hidden')
        }
        function hideError(){errorMessage.classList.add('hidden')}
        function showResults(){resultSection.classList.remove('hidden')}
        function hideResults(){resultSection.classList.add('hidden')}
    }
