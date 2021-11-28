const Op = require('sequelize').Op;
const { User, Post, Image, Hashtag } = require('./models');

function convertStrToArray(text) {
    const regex = /#[^\s#]+/g;
    const match = text.match(regex);
    if (!match) {
        return text;
    }
    let result = [];
    let substr = "";
    substr = text.slice(0, text.search(match[0]));
    if (substr) {
        result.push(substr);
    }
    result.push(match[0]);
    for (let i = 1; i < match.length; i++) {
        substr = text.slice(text.search(match[i-1]) + match[i-1].length, text.search(match[i]));
        if (substr) {
            result.push(substr);
        }
        result.push(match[i]);
    }
    substr = text.slice(text.search(match[match.length-1]) + match[match.length-1].length, text.length);
    if (substr) {
        result.push(substr);
    }
    return result;
};

function convertDateToStr(date) {
    return date.getFullYear() + "." + date.getMonth() + "." + date.getDate() + "." + date.getHours() + ":" + date.getMinutes();
};

function convertPosts(posts) {
    return posts.map(item => {
        return {
                user: item['dataValues']['User']['nick'],
                text: convertStrToArray(item['dataValues']['content']),
                date: convertDateToStr(item['dataValues']['updatedAt']),
                image: item['Images'].map(item => {
                    return 'http://web.expertly.info/~web16/SSUstagram/' + item['path'];
                }),
        };
    });
};

async function searchTotal() {
    return await Post.findAll({
        include: [
            {
                model: User,
                attributes: ['nick'],
            },
            {
                model: Image,
            },
        ],
    });
}

async function searchExactUser(userNick) {
    return await Post.findAll({
        include: [
            {
                model: User,
                attributes: ['nick'],
            },
            {
                model: Image,
            },
            {
                model: Hashtag,
            },
        ],
        where: [
            {
                '$User.nick$': userNick,
            }
        ],
    });
}

async function searchLikeUser(userNick) {
    return await Post.findAll({
        include: [
            {
                model: User,
                attributes: ['nick'],
            },
            {
                model: Image,
            },
            {
                model: Hashtag,
            },
        ],
        where: [
            {
                '$User.nick$': { [Op.like]: `%${userNick}%` },
            }
        ],
    });
}

async function searchExactHashtag(tag) {
    return await Post.findAll({
        include: [
            {
                model: User,
                attributes: ['nick'],
            },
            {
                model: Image,
            },
            {
                model: Hashtag,
            },
        ],
        where: [
            {
                '$Hashtags.title$': tag,
            }
        ],
    });
}

async function searchLikeHashtag(tag) {
    return await Post.findAll({
        include: [
            {
                model: User,
                attributes: ['nick'],
            },
            {
                model: Image,
            },
            {
                model: Hashtag,
            },
        ],
        where: [
            {
                '$Hashtags.title$': { [Op.like]: `%${tag}%` },
            }
        ],
    });
}

async function searchLikeText(text) {
    return await Post.findAll({
        include: [
            {
                model: User,
                attributes: ['nick'],
            },
            {
                model: Image,
            },
            {
                model: Hashtag,
            },
        ],
        where: [
            {
                '$Post.content$': { [Op.like]: `%${text}%` },
            }
        ],
    });
}

async function getPostsFromQuery(query) {
    let posts;
    if(!query['search_method']) {
        posts = await searchTotal();
    }
    else if (query['search_method'] == "exact") {
        if (query['search_type'] == "user") {
            posts = await searchExactUser(query['search_keyword']);
        }
        else if (query['search_type'] == "hashtag") {
            posts = await searchExactHashtag(query['search_keyword']);
        }
    }
    else if (query['search_method'] == "like") {
        if (query['search_type'] == "user") {
            posts = await searchLikeUser(query['search_keyword']);
        }
        else if (query['search_type'] == "hashtag") {
            posts = await searchLikeHashtag(query['search_keyword']);
        }
        else if (query['search_type'] == "text") {
            posts = await searchLikeText(query['search_keyword']);
        }
    }
    return convertPosts(posts);
};

module.exports = { getPostsFromQuery };
