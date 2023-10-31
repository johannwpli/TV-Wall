/* Author: Johann Li, GitHub: https://github.com/johannwpli/ */

let

  tvwallPercent = 1, // fail-safe
  intervalSetTvSize,
  intervalSetTvSizeFlag = false,
  intervalSetTvSizeDelay = 1500, // i.e. 1.5 secs
  tvNumberFlag = 0, // default
  maxThtrNumber

const

  numberToAlphanumeric = (e) => {
    return e.toString(36)
  },

  alphanumericToNumber = (e) => {
    return parseInt(e, 36)
  },

  removeAllFirstChild = (e) => {
    while (e.firstChild)
      e.firstChild.remove()
  },

  setThtrSelect = () => {
    docCellThtr = document.querySelector('.cell.thtr')

    removeAllFirstChild(docCellThtr)
    
    selectThtr = ''
    selectThtrObj[selectThtrDefault] = '0'

    docCellThtr.insertAdjacentHTML('afterBegin', '<select id="thtr"></select>')
    docCellThtr.insertAdjacentHTML('afterBegin', `<label class="${selectLangDefault}"></label>`)
maxThtrNumber
    thtrSelect = document.querySelector('#thtr')

    // console.log({tvSrcArr})
    // console.log({tvSrcArrCached})
    // console.log(selectThtrObj)

    for (const k in selectThtrObj)
      if (k !== '0') delete selectThtrObj[k]

    // console.log(selectThtrObj)

    if (tvSrcArrCached) {
      // console.log('tvSrcArrCached is available')
      // console.log({tvSrcArrCached})
      
      maxThtrNumber = (gridChecked.value === 'all')
        ? tvSrcArrCached.length
        : Math.min(gridChecked.value, tvSrcArrCached.length)

      // console.log({maxThtrNumber})

      for (let i = 0; i < maxThtrNumber; i++) {
        selectThtrObj[i + 1] = (typeof tvSrcArrCached[i] === 'object')
          ? tvSrcArrCached[i]['id']
          : tvSrcArrCached[i]
      }
    }
    else {
      // console.log('tvSrcArrCached is NOT available')
      tvSrcKey = menuChecked.value
      // console.log({tvSrcKey})

      tvSrcArr = (tvSrcObj.hasOwnProperty(tvSrcKey))
        ? tvSrcObj[tvSrcKey]
        : urlIdParam.split(',')

      // console.log({tvSrcArr})

      maxThtrNumber = (gridChecked.value === 'all')
        ? tvSrcArr.length
        : Math.min(gridChecked.value, tvSrcArr.length)

      // console.log({maxThtrNumber})

      for (let i = 0; i < maxThtrNumber; i++) {
        selectThtrObj[i + 1] = (typeof tvSrcArr[i] === 'object')
          ? tvSrcArr[i]['id']
          : tvSrcArr[i]
      }
    }

    // console.log(selectThtrObj)

    for (let [k, v] of Object.entries(selectThtrObj)) {
      k = k * 1 // convert to number

      if (k >= 10) {
        delete selectThtrObj[k]
        selectThtrObj[numberToAlphanumeric(k)] = v
      }
    }

    // console.log(selectThtrObj)

    for (const k in selectThtrObj) {
      (k === '0')
        ? selectThtr += `<option name="thtr" value="${k}">${selectThtrObj[k]}</option>`
        : selectThtr += `<option name="thtr" value="${k}">${k}</option>`

      // console.log(typeof(k))
    }

    document.querySelector('.cell.thtr select').insertAdjacentHTML('beforeEnd', selectThtr)

    document.querySelector(`option[value='${selectThtrDefault}']`).setAttribute('selected', 'selected')
  },

  setLangSelect = (value) => {
    langClasslistAdd(value)

    const toRemoveLangArr = Object.keys(selectLangObj).filter((v) => v !== value)

    for (const i of toRemoveLangArr)
      langClasslistRemove(i)
  },

  /* set grid value by grid radio */

  clickGridRadio = function() {
    // if (gridChecked) console.log(gridChecked.value)
    if (this !== gridChecked) gridChecked = this
    // console.log(this.value)

    setTv()
    setUrl()
    setThtr()
  },

  /* set menu value by menu radio */

  clickMenuRadio = function() {
    // if (menuChecked) console.log(menuChecked.value)
    if (this !== menuChecked) menuChecked = this
    // console.log(this.value)

    setTv()
    setUrl()
    setThtr()
  },

  listenGridMenuRadio = () => {
    for (const i of gridRadio)
      i.addEventListener('click', clickGridRadio)

    for (const j of menuRadio)
      j.addEventListener('click', clickMenuRadio)
  },

  clickThtrSelect = (event) => {
    // console.log(event)
    // console.log({tvNumberFlag})
    // console.log(thtrSelect.value)
    // console.log({tvSrcArrCached})

    if (thtrSelect.value === '0') {
      setIntervalSetTvSize(true)
      setTvSize()
      tvNumberFlag = 0
      
      for (let i = 1; i <= tvRowNumber; i++)
          document.getElementById(`row${i}`).classList.remove('hide')
    }
    else {
      setIntervalSetTvSize(false)
      tvNumberFlag = alphanumericToNumber(thtrSelect.value)

      let _temp = gridChecked.value === 'all' ? tvSrcArrCached.length : gridChecked.value * 1

      for (let i = 1; i <= _temp; i++) {
        // console.log(_temp) // number

        let e = document.getElementById(`tv${numberToAlphanumeric(i)}`)
        // console.log(e)
        // console.log(thtrSelect.value)

        if (e) {
          if (i !== alphanumericToNumber(thtrSelect.value)) {
            e.setAttribute('width', '0')
            e.setAttribute('height', '0')
          }
          else {
            e.setAttribute('width', screenWidth)
            e.setAttribute('height', screenHeight)
          }
        }
      }

      // console.log({tvAllNumber}) // 12
      // console.log({tvRowNumber}) // 4
      // console.log({tvColNumber}) // 3
  
      let rowNumber  = Math.floor((alphanumericToNumber(thtrSelect.value) - 1 ) / tvColNumber) + 1 // 7,8,9 => 6,7,8 => 2,2.x,2.y => 2 => 3
      // console.log({rowNumber})
  
      for (let i = 1; i <= tvRowNumber; i++) {
        let e = document.getElementById(`row${i}`)
        i !== rowNumber ? e.classList.add('hide') : e.classList.remove('hide')
      }
    }

    // console.log({tvNumberFlag})
    // console.log(thtrSelect.value)
  },

  listenThtrSelect = () => document.querySelector('.cell.thtr select').addEventListener('change', clickThtrSelect),

  langClasslistAdd = (value) => {
    for (let i = 1; i < headPartArr.length; i++)
      document.querySelector(`.${headPartArr[i]} label:first-of-type`).classList.add(value)
  },

  langClasslistRemove = (value) => {
    for (let i = 1; i < headPartArr.length; i++)
      document.querySelector(`.${headPartArr[i]} label:first-of-type`).classList.remove(value)
  },

  clickLangSelect = (e) => {
    langClasslistAdd(e.target.value)

    const toRemoveLangArr = Object.keys(selectLangObj).filter((v) => v !== e.target.value)
    // console.log(toRemoveArr)

    for (const i of toRemoveLangArr)
      langClasslistRemove(i)

    setUrl()
  },

  listenLangSelect = () => document.querySelector('.cell.lang select').addEventListener('change', clickLangSelect),

  listenKeyPress = () => {
    /* capture keyboard input, https://codepen.io/DBoy_Fresh/pen/RgjYKG */

    document.onkeydown = (e) => {
      let keyPress = e.key
      // console.log({keyPress})
      // console.log(selectThtrObj)
      // console.log(keyPress in selectThtrObj)

      /* check if thtr equals to key pressed */

      if (keyPress in selectThtrObj) {
        thtrSelect.querySelectorAll(`option[value="${keyPress}"]`)[0].selected = 'selected'
        // console.log(thtrSelect.value)
        clickThtrSelect()
      }

      /* check if menu prefixes with key pressed, https://stackoverflow.com/questions/53093241/check-if-string-is-starting-with-prefix */

      // for (let menu of radioMenuShow) {
      //   if (menu.toLowerCase().indexOf(keyPress.toLowerCase()) === 0) {
      //     // console.log(menu)
      //     document.querySelector('div.menu').querySelectorAll(`input[value="${menu}"]`)[0].checked = 'checked'
      //     clickMenuRadio()
      //   }
      // }
    }
  },

  resizeTvSize = () => {
    getWidthAndHeight()
    clickThtrSelect()
  },

  listenWindowResize = () => window.addEventListener('resize', resizeTvSize),

  /* get css property pixel value */

  getCssPx = (e,p) =>
    getComputedStyle(e).getPropertyValue(p).replace('px', '') * 1 // convert to number

  /* get width and height of  tv and screen */

  getWidthAndHeight = () => {
    // console.log({head})
    // console.log({body})
    // console.log({tvNumberFlag})

    if (tvNumberFlag) {
      let _temp = tvNumberFlag - 1
      tv = document.querySelectorAll('.tv')[_temp]
      iframe = document.querySelectorAll('iframe')[_temp]
    }
    else {
      tv = document.querySelector('.tv')
      iframe = document.querySelector('iframe')
    }

    bodyBorderWidth = getCssPx(body, 'border-width') * 2
    headBorderWidth = getCssPx(head, 'border-width') * 2
    headHeight = getCssPx(head, 'height')
    iframeBorderWidth = getCssPx(iframe, 'border-width') * 2

    // console.log({bodyBorderWidth})
    // console.log({headBorderWidth})
    // console.log({headHeight})
    // console.log({iframeBorderWidth})

    widthDiff = bodyBorderWidth
    heightDiff = bodyBorderWidth + headBorderWidth + headHeight

    // console.log({widthDiff})
    // console.log({heightDiff})

    tvNowWidth = getCssPx(tv, 'width')
    tvNowHeight = getCssPx(tv, 'height')
    iframeNowWidth = getCssPx(iframe, 'width')
    iframeNowHeight = getCssPx(iframe, 'height')

    // console.log({tvNowWidth})
    // console.log({tvNowHeight})
    // console.log({iframeNowWidth}) // default 300
    // console.log({iframeNowHeight}) //default 150

    // iframeGapWidth = tvNowWidth - iframeNowWidth
    iframeGapHeight = tvNowHeight - iframeNowHeight

    // console.log({iframeGapWidth})
    // console.log({iframeGapHeight}) // dynamic

    // console.log(getComputedStyle(tvWall).getPropertyValue('width').replace('px', ''))
    // console.log(window.innerWidth)

    tvwallPercent = getComputedStyle(tvWall).getPropertyValue('width').replace('px', '') / window.innerWidth
    // console.log({tvwallPercent})

    docWidth = (window.innerWidth - widthDiff) * tvwallPercent
    docHeight = window.innerHeight - heightDiff

    // console.log('window.innerWidth: ', window.innerWidth)
    // console.log('window.innerHeight: ', window.innerHeight)
    // console.log({docWidth})
    // console.log({docHeight})

    tvWidth = docWidth / tvColNumber - iframeBorderWidth // - iframeGapWidth // cause wrong width
    tvHeight = docHeight / tvRowNumber - iframeBorderWidth - iframeGapHeight

    // console.log({tvWidth})
    // console.log({tvHeight})

    screenWidth = docWidth - iframeBorderWidth
    screenHeight = docHeight - iframeBorderWidth - iframeGapHeight

    // console.log({screenWidth})
    // console.log({screenHeight})
  },

  /* set tv size by window size */

  setTvSize = () => {
    getWidthAndHeight()

    document.querySelectorAll('#tvWall iframe').forEach(
      (e,i) => {
        let _temp = numberToAlphanumeric(i + 1)

        e.setAttribute('id', `tv${_temp}`)
        e.setAttribute('width', tvWidth)
        e.setAttribute('height', tvHeight)
      }
    )
  },

  /* set grid layout by grid value */

  setTvGrid = () => {
    menuChecked = document.querySelector('input[name="menu"]:checked')
    // console.log(menuChecked.value)
    tvSrcKey = menuChecked.value
    // console.log({tvSrcKey})

    tvSrcArr = (tvSrcObj.hasOwnProperty(tvSrcKey))
      ? tvSrcObj[tvSrcKey]
      : urlIdParam.split(',')

    // console.log({tvSrcArr})
    // console.log({radioGridArr})
    // console.log(radioGridArr[radioGridArr.length - 2])

    if (gridChecked.value === 'all') {
      if (tvSrcArr.length >= radioGridArr[radioGridArr.length - 2]) {
        tvAllNumber = radioGridArr[radioGridArr.length - 2]
      }
      else {
        let _temp = tvSrcArr.length
        while (!radioGridArr.includes(_temp))
          _temp++
        tvAllNumber = _temp
      }
    }
    else {
      tvAllNumber = gridChecked.value
    }
    // console.log({tvSrcArr})
    
    tvShortNumber = Math.floor(Math.sqrt(tvAllNumber))
    // tvAllNumber: tvShortNumber; 1~3: 1, 4~8: 2, 9~15: 3, 16~24: 4

    window.innerWidth >= window.innerHeight
      ? tvColNumber = tvAllNumber / (tvRowNumber = tvShortNumber)
      : tvRowNumber = tvAllNumber / (tvColNumber = tvShortNumber)

    // console.log({tvAllNumber})
    // console.log({tvRowNumber})
    // console.log({tvColNumber})

    /* innerHTML vs removeChild vs remove, https://www.measurethat.net/Benchmarks/Show/6910/0/innerhtml-vs-removechild-vs-remove#latest_results_block */

    removeAllFirstChild(body)

    for (let i = 0; i < tvRowNumber; i++) {
      let _temp = i + 1
      body.insertAdjacentHTML('beforeEnd', `<div class="row" id="row${_temp}"></div>`)
    }

    document.querySelectorAll('#body .row').forEach(
      (e,i) => {
        for (let j = 0; j < tvColNumber; j++)
          e.insertAdjacentHTML('beforeEnd', `<div class="cell tv"></div>`)
      }
    )
  },

  /* shuffle array with Fisher-Yates algo, https://shubo.io/javascript-random-shuffle/ */

  shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
  },

  setTvSrc = () => {
    tvSrcArrCached = [...tvSrcArr]

    if (tvSrcArrCached.length > tvAllNumber)
      shuffle(tvSrcArrCached)

    // console.log('TV Array Length: ', tvSrcArr.length)
    // console.log({tvAllNumber})
    // console.log({tvSrcArr})
    // console.log({tvSrcArrCached})

    tvRatio =
      tvAllNumber < tvSrcArrCached.length
        ? `${tvAllNumber} of ${tvSrcArrCached.length}`
        : `${tvSrcArrCached.length} of ${tvSrcArrCached.length}`

    console.group('Now Playing (' + tvRatio + ')')

    const setTvHtml = () => {
      // let tvNumber = 1
      document.querySelectorAll('#body .tv').forEach(
        (e,i) => {
          let _temp = numberToAlphanumeric(i + 1)

          // console.log(_temp)
          // console.log(e)
          e.removeAttribute('alt')
          e.removeAttribute('title')
          // console.log(tvSrcArrCached[i])

          if (tvSrcArrCached[i]) {
            if (typeof tvSrcArrCached[i] === 'object') {
              // console.log( tvSrcArrCached[i]['id'])
              tvSrc = tvSrcPrefix + tvSrcArrCached[i]['id']
              tvTitle = tvSrcArrCached[i]['title']
              tvChannel = tvSrcArrCached[i]['channel']

              tvInfo = _temp + '. '
              if (tvTitle) tvInfo += tvTitle
              tvInfo += ' ' + tvSrc
              if (tvChannel) tvInfo += ' on ' + tvChannel

              // e.setAttribute('id', _temp)
              e.setAttribute('alt', tvSrcKey + ' > ' + tvTitle)
              e.setAttribute('title', _temp + '. ' + tvTitle)
            }
            else {
              tvSrc = tvSrcPrefix + tvSrcArrCached[i]

              tvInfo = _temp + '. '
              tvInfo += ' ' + tvSrc
            }

            console.log(tvInfo)

            removeAllFirstChild(e)

            // console.log({tvSrc})

            tvHtml = `<div class='tvNumber'>${_temp}</div>
              <iframe frameborder='${tvBorder}' allow='${tvAllow}' ${tvAllowfullscreen} src='${tvSrc}'></iframe>`

            e.insertAdjacentHTML('beforeEnd', tvHtml)
          }
        }
      )
    }

    // setTimeout(() => { setTvHtml() }, 50)
    setTvHtml()
  
    console.groupEnd()
  },

  setIntervalSetTvSize = (status) => {
    // console.log({intervalSetTvSizeFlag})

    if (status) {
      if (!intervalSetTvSizeFlag) {
        intervalSetTvSize = setInterval(setTvSize, intervalSetTvSizeDelay) // to fix iframe native bug returning from fullscreen
        intervalSetTvSizeFlag = true
      }
    }
    else {
      if (intervalSetTvSizeFlag) {
        clearInterval(intervalSetTvSize)
        intervalSetTvSizeFlag = false
      }
    }

    // console.log({intervalSetTvSizeFlag})
  },

  setThtr = () => {
    setThtrSelect()
    listenThtrSelect()
  },

  listenAll = () => {
    listenGridMenuRadio()
    listenLangSelect()
    listenKeyPress()
    listenWindowResize()
  },

  setTv = () => {
    setTvGrid()
    setTvSrc()
    setTvSize()
    setIntervalSetTvSize(true)
  },

  tvwall = () => {
    setThtr()
    setLangSelect(langSelect.value)
    listenAll()
    setTv()
  }

tvwall()