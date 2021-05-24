function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  
browser.runtime.onMessage.addListener(async function(request){
    if (request.reload) {
        await sleep(2000)
        myMain();
    }
});

window.addEventListener ("load", myMain, false);

function formatDate(date) {
    if (date === "") {
        return {
            ok: false, 
            date: date,
        }
    }
    console.log(date)
    // const datePattern = /^(\d{4})-(\d{2})-(\d{2})\s(\d{1,2}):(\d{2})$/;
    const datePattern = /^(?<month>\w{3})\s(?<day>\d{1,2})(,\s(?<year>\d{4}))?(?<rest>\s?@.*)?/;
    let matches = datePattern.exec(date)
    if (!matches) {
        return {
            ok: false, 
            date: date,
        }
    }
    let month = matches.groups.month
    let day = matches.groups.day
    let year = matches.groups.year

    if (month === "") {
        return {
            ok: false, 
            date: date,
        }
    }

    if (!year) {
        year = new Date().getFullYear()
    } 

    let dt = new Date(`${month}, ${day} ${year}`);
    let human = dt.toLocaleDateString(
        'en-in',
        {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          weekday: 'short',
        }
    );

    return {
        ok: true,
        date: human + (matches.groups.rest ? matches.groups.rest: "")
    }
}

async function myMain() {
    const target = document.getElementById('gqQueueContentMainPanel');

    const config = { attributes: true, childList: true, subtree: true, CharacterData: true};
    updateText(target)

     const callback = async function(mutationsList, observer) {
         for(const mutation of mutationsList) {
            console.log(mutation)
            updateText(target)
         }
     };

     const observer = new MutationObserver(callback);

     observer.observe(target, config);
}

function updateText(target) {
    const ts = target.querySelectorAll('.gq-i-date-text');

    for (var i = 0; i < ts.length; i++) {
        // update text
        const r = formatDate(ts[i].textContent)
        if (r.ok) {
            ts[i].textContent = r.date
        }
     }
}