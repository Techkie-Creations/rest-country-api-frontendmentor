if (sessionStorage.getItem('mode') == null) {
    sessionStorage.setItem('mode', 'light')
    sessionStorage.setItem('bg', 'bg-light')
}

var data
let counts = []

async function getData()  {
    await fetch('./data.json')
        .then(res => res.json())
        .then(json => {
            localStorage.setItem('data', JSON.stringify(json));
        })
}

getData()

data = JSON.parse(localStorage.getItem('data'))
console.log(data)
counts = data.map(elem => elem.name)



let searched = data

let findBorder = (country) => {
    let border = data.filter(item => item.name == country && item.hasOwnProperty('borders'))
    
    if (border.length > 0) {
        let borders = border.map(item => item.borders.map(c => data.filter(d => d.alpha3Code == c)).flat()).flat()
        return borders.map(c => c.name)
    } else {
        return false
    }
    
}

let status = sessionStorage.getItem('mode')

document.getElementsByTagName('body')[0].setAttribute('class', sessionStorage.getItem('bg'))
document.getElementsByTagName('header')[0].setAttribute('class', status)
document.getElementById('switch').innerHTML = `${status === 'dark' ? 'Light' : 'Dark'} Mode`
document.getElementById('mode').setAttribute('class', `btn icon ${status}en`)
let mode = () => {
    let mode = sessionStorage.getItem('mode')
    let bg = sessionStorage.getItem('bg')
    document.querySelector('.form-select').classList.remove(mode)
    document.querySelectorAll('.icon').forEach(elem => elem.classList.remove(mode))
    if (mode === 'light') {
        mode = 'dark'
        bg = 'bg-dark'
        document.getElementsByTagName('body')[0].setAttribute('class', bg)
    } else {
        mode = 'light'
        bg = 'bg-light'
        document.getElementsByTagName('body')[0].setAttribute('class', bg)
    }
    sessionStorage.setItem('mode', mode)
    sessionStorage.setItem('bg', bg)

    document.getElementsByTagName('header')[0].setAttribute('class', mode)
    document.getElementById('inp').setAttribute('class', `form-control ${mode}`)
    document.querySelector('.form-select').classList.add(mode)
    document.querySelectorAll('.tile').forEach(elem => elem.setAttribute('class', `tile btn ${mode}`))
    document.querySelectorAll('.icon').forEach(elem => elem.classList.add(mode))
    document.getElementById('switch').innerHTML = `${mode === 'dark' ? 'Light' : 'Dark'} Mode`
    document.getElementById('mode').setAttribute('class', `btn icon ${mode}en`)

}

const chosen = (selected) => {
    document.getElementsByClassName('picked')[0].innerHTML = data.filter(elem => elem.name === selected).map(elem => `<button class="btn icon ${sessionStorage.getItem('mode')}" onclick="back()"><i class="fa-solid fa-arrow-left icon"></i> Back</button>
    <div class="unique">
        <img src="${elem.flag}" alt="${elem.name} flag" />
        <div class="side">
            <div class="more-info">
                <p class="info-head">${elem.name}</p>
                <div class="info">
                    <div class="info1">
                        <p><span class="bold">Native Name: </span>${elem.nativeName}</p>
                        <p><span class="bold">Population: </span>${elem.population.toLocaleString('en-US')}</p>
                        <p><span class="bold">Region: </span>${elem.region}</p>
                        <p><span class="bold">Sub Region: </span>${elem.subregion}</p>
                        <p><span class="bold">Capital: </span>${elem.capital}</p>
                    </div>
                    <div class="info2">
                        <p><span class="bold">Top Level Domain: </span>${elem.topLevelDomain[0]}</p>
                        <p><span class="bold">Currency: </span>${elem.currencies.map(item => item.name).join('')}</p>
                        <p><span class="bold">Languages: </span>${elem.languages.map(item => item.name).join(', ')}</p>
                    </div>
                </div>
                
            </div>
            <div class="borders">
                <p class="bold space">Border Countries: </p>
                <div class="count">
                    ${findBorder(elem.name) == false ? `<span class="block icon ${sessionStorage.getItem('mode')}">No Border Countries</span>` : findBorder(elem.name).map(item => `<span class="block  icon ${sessionStorage.getItem('mode')}">${item}</span>`).join('')}
            
                </div>
            </div>
        </div>
    </div>`)
    document.getElementsByClassName('picked')[0].classList.remove('none')
    document.getElementById('content').classList.add('none')
    document.getElementsByClassName('filters')[0].classList.add('none')
}

let back = () => {
    document.getElementById('content').classList.remove('none')
    document.getElementsByClassName('filters')[0].classList.remove('none')
    document.getElementsByClassName('picked')[0].classList.add('none')
}

class Countries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            filter: '',
            msg: 'none',
        }
    }

    handleChange = (e) => {
        this.setState({
            input: e.target.value,
        })

        if (e.target.value.length > 0 && this.state.filter.length > 0 && this.state.filter !== 'all') {
            searched = data.filter(elem => {
                return elem.name.toLowerCase().startsWith(e.target.value.toLowerCase()) && elem.region.toLowerCase() === this.state.filter
            })
        }else if(e.target.value.length > 0) {
            searched = data.filter(elem => {
                return elem.name.toLowerCase().startsWith(e.target.value.toLowerCase())
            })
        } else {
            if (this.state.filter == 'all' || this.state.filter == '') {
                searched = data
            } else {
                searched = data.filter(elem => elem.region.toLowerCase() == this.state.filter)
            }
        }
        if (!searched.length) {
            this.setState({msg: ''})
        } else {
            this.setState({msg: 'none'})
        }
        
    }

    handleClick = (e) => {
        this.setState({
            filter: e.target.value
        })
        if (e.target.value == 'all' || e.target.value == '' && this.state.input.length > 0) {
            searched = data.filter(elem => elem.name.toLowerCase().startsWith(this.state.input.toLowerCase()))
        } else if (e.target.value !== 'all' || e.target.value !== '' && this.state.input.length > 0) {
            searched = data.filter(elem => {
                return elem.name.toLowerCase().startsWith(this.state.input.toLowerCase()) && elem.region.toLowerCase() === e.target.value
            })
        } else if (e.target.value == 'all' || e.target.value == '' && this.state.input.length == 0) {
            searched = data
        } else {
            searched = data.filter(elem => elem.region.toLowerCase() == e.target.value)
        }

        if (!searched.length) {
            this.setState({msg: ''})
        } else {
            this.setState({msg: 'none'})
        }

        console.log(searched)
        console.log(e.target.value)
    }

    render() {
        let mode = sessionStorage.getItem('mode')
        let grid = searched.map(elem => `<div class="tile btn ${mode}" onclick="chosen('${elem.name}')">
        <img src="${elem.flag}" alt="${elem.name} flag" />
        <div class="detail">
          <p class="random">${elem.name}</p>
          <p><span class="bold">Population: </span>${elem.population.toLocaleString('en-US')}</p>
          <p><span class="bold">Region: </span>${elem.region}</p>
          <p><span class="bold">Capital: </span>${elem.capital == undefined ? 'Unknown Capital' : elem.capital}</p>
        </div>
      </div>`)
        document.getElementById('content').innerHTML = grid.join('')
        return (
            <div className="main">
                <div className="filters">
                    <form >
                        <div className="search-box">
                            <div className="input-group input-group-lg">
                                <span className={`input-group-addon icon ${mode}`}><i className="fa-solid fa-magnifying-glass"></i></span>
                                <input onChange={this.handleChange.bind(this)} value={this.state.input} type="text" className={`form-control ${mode}`} id="inp" aria-describedby="inputGroupSuccess1Status" placeholder="Search for a country" autocomplete="off" />
                            </div>
                        </div>
                        <select onClick={this.handleClick.bind(this)} className={`form-select input-lg form-control ${mode}`} aria-label="Default select example">
                            <option disabled selected hidden value="all">Filter by region</option>
                            <option value="all">All</option>
                            <option value="africa">Africa</option>
                            <option value="americas">America</option>
                            <option value="asia">Asia</option>
                            <option value="europe">Europe</option>
                            <option value="oceania">Oceania</option>
                        </select>
                    </form>
                    <div className={`message ${this.state.msg}`}>
                        <p className="inner-msg"><i class="fa-solid fa-magnifying-glass sizer"></i> <p>Please Input A Valid Country Or Set Filter To <span class="bold note">"All"</span> Before Searching!!</p></p>
                    </div>
                </div>
                
            </div>
        )
    }
}

ReactDOM.render(<Countries />, document.getElementById('data'))