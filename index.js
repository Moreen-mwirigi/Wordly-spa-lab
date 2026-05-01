const apiUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

const themeToggle = document.getElementById('theme-toggle')
const searchForm = document.getElementById('search-form')
const wordInput = document.getElementById('input-word')
const errorMessage = document.getElementById('error-message')
const errorText = document.getElementById('error-text')
const loader = document.getElementById('loader')
const resultSection = document.getElementById('result-section')
const favoriteSection = document.getElementById('favourites-section')
const favoritesList = document.getElementById('favorites-list')
const favoritesEmpty = document.getElementById('favorites-empty')

let currentWord = ''
let favorites = JSON.parse(localStorage.getItem('wordly-favorite')) || []

document.addEventListener('DOMContentLoaded', () => {
    renderFavorites()
    loadTheme()
})
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const word = wordInput.value.trim()
    if (word) searchWord(word)
})
themeToggle.addEventListener('click', toggleTheme)

async function searchWord(word) {
    showLoader()
    hideError()
    hideResults()

    try{
        const res = await fetch(`${apiUrl}${word}`)
        if (!res.ok) throw new Error('Word not found')
            const data = await res.json()
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
console.log('word element:', document.getElementById('word'))
console.log('phonetic element:', document.getElementById('phonetic'))
console.log('audio element:', document.getElementById('audio'))
console.log('save-btn element:', document.getElementById('save-btn'))
console.log('meanings element:', document.getElementById('meanings'))


function displayResult(data) {
    document.getElementById('loader')?.classList.add('hidden')
    document.getElementById('error-message')?.classList.add('hidden')
    document.getElementById('meanings').innerHTML = ''
   
    console.log('1. api data received:', data)

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

const saveBtn = document.getElementById('save-btn')
if(saveBtn){
    updateSaveBtn(saveBtn, data.word)
    saveBtn.onclick = () => toggleFavorite(data.word)
}
function updateSaveBtn(btn, word){
    if(!btn) {
        console.log('Save button not found')
     return
    }
    const icon = btn.querySelector('.material-icons-round')
    if(!icon) {
        console.log('Icon span missing')
        return
    } 
    if (favorites.includes(word)){
        icon.textContent = 'bookmark'
        btn.classList.add('active') 
    } else{
        icon.textContent = 'bookmark_border'
        btn.classList.remove('active')
    }

}
//if (saveBtn){
    //updateSaveBtn(btn, data.word)
  //  saveButton.onclick = () => toggleFavorite(data.word)
//}

const meaningsDiv = document.getElementById('meanings')
console.log('2. meaningsDiv found:', meaningsDiv)

if (!meaningsDiv){
    console.error('ERROR: Missing html line')
    showError('html error')
    return
}

meaningsDiv.innerHTML = ''
console.log('3. looping through meaning:', data.meanings)

data.meanings?.forEach((meaning, index) => {
    console.log(`4. processing meaning ${index}:`, meaning)
    const meaningEl = document.createElement('div')
    meaningEl.className = 'meaning'

    const definitionsHTML = meaning.definitions?.slice(0, 3).map((def, i) => `
    <div class="definition">
    <p> ${i + 1}. ${def.definition}</p>
    ${def.example? `<p class="example"> "${def.example}" </p>` : ''}
    </div>
    `).join('') 

    const synonymsHTML = meaning.synonyms && meaning.synonyms.length?`
    <div class ="chip-group">
    <p class ="chip-title">Synonyms:</p>
    ${meaning.synonyms.slice(0,5).map(s => `<span class="chip"> ${s}</span>`).join('')}
    </div>
    ` :''

    meaningEl.innerHTML = `
    <span class="part-of-speech">${meaning.partOfSpeech}</span>
    ${definitionsHTML}
    ${synonymsHTML}
    
      ${meaning.definitions.slice(0, 3).map((def, i) =>`
        <div class = "definition">
        <p> ${i + 1}. ${def.definition} </p>
        ${def.example? `<p class="example"> "${def.example}"</p>` : ''}
        </div>
        `).join('')} || '<p> No definitions found </p>'
        ${meaning.synonyms && meaning.synonyms.length? `
            <div class="chip-group">
            ${meaning.synonyms.slice(0, 5).map(s => `<span class ="chip"> ${s}</span>`).join('')}
            </div>
            ` : ''}
            `
           meaningsDiv.appendChild(meaningEl) 
        })
        const sourceDiv = document.getElementById('source')
           if (sourceDiv){
            sourceDiv.innerHTML = data.sourceUrls?
           `<small> Source: <a href="${data.sourceUrls[0]}" target ="_blank">${data.sourceUrls[0]}</a></small>` : ''
           }
           console.log('5. Done rendering')
           showResults()
           
    } 
        function toggleTheme(){
            const currentTheme = document.documentElement.getAttribute('data-theme')
            const newTheme = currentTheme === 'dark'?'light' : 'dark'
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
            updateSaveBtn(document.getElementById('save-btn'), word)
        }
        function renderFavorites(){
            favoritesList.innerHTML = ''
            if (favorites.length === 0){
                favoritesEmpty.classList.remove('hidden')
                return
            }
        favoritesEmpty.classList.add('hidden')

        favorites.forEach(word =>{
            const chip = document.createElement('button')
            chip.className = 'chip'
            chip.textContent = word
            chip.onclick = () => {
                wordInput.value = word
                searchWord(word)
            }
            favoritesList.appendChild(chip)
        })}

        function updateSaveBtn(btn, word){
            const icon = btn.querySelector('.material-icons-round')
            if (favorites.includes(word)){
                icon.textContent = 'bookmark'
                btn.classList.add('active')
            }else {
                icon.textContent='bookmark_border'
                btn.classList.remove('active')
            }
        }
        function showLoader(){loader.classList.remove('hidden')}
        function hideLoader(){
            document.getElementById('loader').classList.add('hidden')
            //loader.classList.add('hidden')
            }
        function showError(message){
            errorText.textContent = message
            errorMessage.classList.remove('hidden')
        }
        function hideError(){
            document.getElementById('error-message').classList.add('hidden')
            //errorMessage.classList.add('hidden')
            }
        function showResults(){
            document.getElementById('result-section').classList.remove('hidden')
            //resultSection.classList.remove('hidden')
            }
        function hideResults(){resultSection.classList.add('hidden')}
    
