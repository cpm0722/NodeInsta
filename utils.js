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
}

function convertDateToStr(date) {
  return date.getFullYear() + "." + date.getMonth() + "." + date.getDate() + "." + date.getHours() + ":" + date.getMinutes();
}

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
}

function convertUsers(users, myFollowings) {
  myFollowings = myFollowings.map(item => item['dataValues']['id']);
  console.log(myFollowings);
  return users.map(item => ({
    'id': item['dataValues']['id'],
    'email': item['dataValues']['email'],
    'name': item['dataValues']['name'],
    'nick': item['dataValues']['nick'],
    'following': myFollowings.findIndex(i => i==item['dataValues']['id']) != -1,
  }));
}

async function getTotalPosts() {
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

async function getPostsByExactUser(userNick) {
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

async function getPostsByLikeUser(userNick) {
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

async function getExactHashtag(tag) {
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

async function getPostsByLikeHashtag(tag) {
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

async function getPostsByLikeText(text) {
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
    posts = await getTotalPosts();
  }
  else if (query['search_method'] == "exact") {
    if (query['search_type'] == "user") {
      posts = await getPostsByExactUser(query['search_keyword']);
    }
    else if (query['search_type'] == "hashtag") {
      posts = await getExactHashtag(query['search_keyword']);
    }
  }
  else if (query['search_method'] == "like") {
    if (query['search_type'] == "user") {
      posts = await getPostsByLikeUser(query['search_keyword']);
    }
    else if (query['search_type'] == "hashtag") {
      posts = await getPostsByLikeHashtag(query['search_keyword']);
    }
    else if (query['search_type'] == "text") {
      posts = await getPostsByLikeText(query['search_keyword']);
    }
  }
  return convertPosts(posts);
};

async function getTotalUsers(user) {
  return convertUsers(await User.findAll({
    where: [
      {
        'id': { [Op.ne]: `${user.id}` },
      }
    ],
  }), await user.getFollowings());
}

module.exports = { getPostsFromQuery, getTotalUsers };
