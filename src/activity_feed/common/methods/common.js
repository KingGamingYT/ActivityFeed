export function chunkArray(cards, num) {
    let chunkLength = Math.max(cards.length / num, 1);
    const chunks = [];
    for (let i = 0; i < num; i++) {
        if(chunkLength*(i+1)<=cards.length)chunks.push(cards.slice(chunkLength*i, chunkLength*(i+1)));
    }
    return chunks.reverse(); 
}