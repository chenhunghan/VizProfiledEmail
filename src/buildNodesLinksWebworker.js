onmessage = function(message) {
    function buildNodesLinksData(response) {
        let threads = []
        let par = 'phrase_user'
        let peerList =  response.data.peer_list.entries()
        for (let [peerIndex, peer] of peerList) {
            let threadList = peer.thread_list.entries()
            for (let [threadIndex, thread] of threadList) {
                let cleanThread = {}
                cleanThread[par] = thread[par]
                cleanThread.subject = thread.subject
                cleanThread.email_list = thread.email_list
                cleanThread.phrase_user = thread.phrase_user
                threads.push(cleanThread)
            }
        }
        let noDuplicatedThreads = [ ...new Set(threads)]
        for (let [index, threadItem] of noDuplicatedThreads.entries()) {
            threadItem.index = index
        }
        threads = noDuplicatedThreads.slice(0,160)
        //threads = threads.slice(0,500)
        let links = []
        for (let sourceThread of threads) {
            let sourceParArray = [ ...new Set(sourceThread[par])]
            for (let targetThread of threads) {
                if (sourceThread.index !== targetThread.index && sourceParArray.length > 0 && targetThread[par].length > 0) {
                    let targetParArray = [ ...new Set(targetThread[par])]
                    let duplicatedLink = links.find(x => x.source === targetThread.index && x.target === sourceThread.index)
                    //
                    if (typeof duplicatedLink === 'undefined') {
                        let matchedArrayLength = sourceParArray.filter(function(el) {
                            return targetParArray.indexOf(el) >= 0;
                        }).length;
                        if (matchedArrayLength > 0) {
                            let linkData = {
                                source: sourceThread.index,
                                target: targetThread.index,
                                similarity:  matchedArrayLength/sourceParArray.length
                            }
                            links.push(linkData)
                        }
                    }
                }
            }
        }
        return {
            links: links,
            nodes: threads
        }
    }
    let data = buildNodesLinksData(JSON.parse(message.data))
    postMessage(data)
}