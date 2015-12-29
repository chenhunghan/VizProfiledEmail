onmessage = function(message) {
    function buildNodesLinksData(message) {
        let threads = []
        let par = 'phrase_user'
        let peerList =  [ ...new Set(message.data.peer_list)]
        for (let peer of peerList) {
            let threadList = peer.thread_list
            for (let thread of threadList) {
                let cleanThread = {}
                cleanThread[par] = thread[par]
                cleanThread.subject = thread.subject
                cleanThread.email_list = thread.email_list
                cleanThread.phrase_user = thread.phrase_user
                threads.push(cleanThread)
            }
        }
        let noDuplicatedThreads = [ ...new Set(threads)]
        threads = noDuplicatedThreads.slice(0,message.options.quantity)
        threads.forEach((thread, index) => {
            thread.index = index
        })
        let length = threads.length
        let links = []

        for (let sourceThread of threads) {
            let sourceParArray = [ ...new Set(sourceThread[par])]
            //postMessage({
            //    percentage: Math.round((sourceThread.index)/length * 100)
            //});
            for (let targetThread of threads) {
                let targetParArray = [ ...new Set(targetThread[par])]
                if (sourceThread.index !== targetThread.index && sourceParArray.length > 0 && targetParArray.length > 0) {
                    let duplicatedLink = links.find(x => x.source === targetThread.index && x.target === sourceThread.index)
                    if (typeof duplicatedLink === 'undefined') {
                        let matchedArray = sourceParArray.filter(function(el) {
                            return targetParArray.indexOf(el) >= 0;
                        });
                        if (matchedArray.length > 0) {
                            let similarity = matchedArray.length/sourceParArray.length;
                            links.push({
                                source: sourceThread.index,
                                target: targetThread.index,
                                similarity:  similarity,
                                matched: matchedArray
                            });
                        }
                    }
                }
            }
        }
        postMessage({
            links: links,
            threads: threads,
            percentage: 100
        })
    }
    buildNodesLinksData(JSON.parse(message.data))
}