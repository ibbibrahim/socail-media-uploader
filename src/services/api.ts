import { Platform, PostType } from '../types';

const FACEBOOK_PAGE_ID = import.meta.env.VITE_FACEBOOK_PAGE_ID || 'YOUR_PAGE_ID';
const FACEBOOK_ACCESS_TOKEN = import.meta.env.VITE_FACEBOOK_ACCESS_TOKEN || 'YOUR_TOKEN';
const INSTAGRAM_USER_ID = import.meta.env.VITE_INSTAGRAM_USER_ID || 'YOUR_IG_USER_ID';
const INSTAGRAM_ACCESS_TOKEN = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN || 'YOUR_TOKEN';

interface PostPayload {
  caption: string;
  hashtags: string;
  mediaUrls: string[];
  postType: PostType;
}

export const postToFacebook = async (payload: PostPayload): Promise<any> => {
  const { caption, hashtags, mediaUrls, postType } = payload;
  const message = `${caption}\n\n${hashtags}`;

  if (postType === 'text') {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}/feed`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          access_token: FACEBOOK_ACCESS_TOKEN,
        }),
      }
    );
    return response.json();
  }

  if (postType === 'image') {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}/photos`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: mediaUrls[0],
          caption: message,
          access_token: FACEBOOK_ACCESS_TOKEN,
        }),
      }
    );
    return response.json();
  }

  if (postType === 'video') {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}/videos`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_url: mediaUrls[0],
          description: message,
          access_token: FACEBOOK_ACCESS_TOKEN,
        }),
      }
    );
    return response.json();
  }

  throw new Error('Unsupported post type for Facebook');
};

export const postToInstagram = async (payload: PostPayload): Promise<any> => {
  const { caption, hashtags, mediaUrls, postType } = payload;
  const fullCaption = `${caption}\n\n${hashtags}`;

  if (postType === 'image') {
    const containerResponse = await fetch(
      `https://graph.facebook.com/v18.0/${INSTAGRAM_USER_ID}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: mediaUrls[0],
          caption: fullCaption,
          access_token: INSTAGRAM_ACCESS_TOKEN,
        }),
      }
    );
    const containerData = await containerResponse.json();

    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${INSTAGRAM_USER_ID}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerData.id,
          access_token: INSTAGRAM_ACCESS_TOKEN,
        }),
      }
    );
    return publishResponse.json();
  }

  if (postType === 'carousel') {
    const childIds = await Promise.all(
      mediaUrls.map(async (url) => {
        const response = await fetch(
          `https://graph.facebook.com/v18.0/${INSTAGRAM_USER_ID}/media`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image_url: url,
              is_carousel_item: true,
              access_token: INSTAGRAM_ACCESS_TOKEN,
            }),
          }
        );
        const data = await response.json();
        return data.id;
      })
    );

    const containerResponse = await fetch(
      `https://graph.facebook.com/v18.0/${INSTAGRAM_USER_ID}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_type: 'CAROUSEL',
          children: childIds.join(','),
          caption: fullCaption,
          access_token: INSTAGRAM_ACCESS_TOKEN,
        }),
      }
    );
    const containerData = await containerResponse.json();

    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${INSTAGRAM_USER_ID}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerData.id,
          access_token: INSTAGRAM_ACCESS_TOKEN,
        }),
      }
    );
    return publishResponse.json();
  }

  if (postType === 'reel') {
    const containerResponse = await fetch(
      `https://graph.facebook.com/v18.0/${INSTAGRAM_USER_ID}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_type: 'REELS',
          video_url: mediaUrls[0],
          caption: fullCaption,
          share_to_feed: true,
          access_token: INSTAGRAM_ACCESS_TOKEN,
        }),
      }
    );
    const containerData = await containerResponse.json();

    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${INSTAGRAM_USER_ID}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerData.id,
          access_token: INSTAGRAM_ACCESS_TOKEN,
        }),
      }
    );
    return publishResponse.json();
  }

  if (postType === 'story') {
    const mediaType = mediaUrls[0].includes('.mp4') ? 'video_url' : 'image_url';
    const containerResponse = await fetch(
      `https://graph.facebook.com/v18.0/${INSTAGRAM_USER_ID}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_type: 'STORIES',
          [mediaType]: mediaUrls[0],
          access_token: INSTAGRAM_ACCESS_TOKEN,
        }),
      }
    );
    const containerData = await containerResponse.json();

    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${INSTAGRAM_USER_ID}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerData.id,
          access_token: INSTAGRAM_ACCESS_TOKEN,
        }),
      }
    );
    return publishResponse.json();
  }

  throw new Error('Unsupported post type for Instagram');
};

export const uploadPost = async (
  platform: Platform,
  payload: PostPayload
): Promise<any> => {
  if (platform === 'facebook') {
    return postToFacebook(payload);
  } else {
    return postToInstagram(payload);
  }
};
