/** Cloudinary cloud name for this project. */
const CLOUD_NAME = "lslwlv9d";

/**
 * Builds a Cloudinary "remote fetch" URL so images are served via CDN.
 * Cloudinary fetches, optimises, and caches each photo automatically.
 *
 * @param {string} remoteUrl - The original image URL to transform.
 * @param {number} [w=200]   - Output width in pixels.
 * @param {number} [h=200]   - Output height in pixels.
 * @returns {string} Cloudinary CDN URL.
 */
const buildCloudinaryUrl = (remoteUrl, w = 200, h = 200) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/w_${w},h_${h},c_fill,g_face,f_auto,q_auto/${encodeURIComponent(remoteUrl)}`;

/**
 * Static list of customer reviews shown in the testimonials carousel.
 *
 * @typedef  {Object} Review
 * @property {number} id
 * @property {string} name
 * @property {string} image
 * @property {number} rating
 * @property {string} text
 *
 * @type {Review[]}
 */
export const reviews = [
  {
    id: 1,
    name: "Ahmed Al-Kurdi",
    image: buildCloudinaryUrl("https://randomuser.me/api/portraits/men/32.jpg"),
    rating: 5,
    text: "Outstanding food quality! The main dishes were incredibly tasty and cooked to perfection. Five stars all the way!",
  },
  {
    id: 2,
    name: "Nourhan Salem",
    image: buildCloudinaryUrl("https://randomuser.me/api/portraits/women/44.jpg"),
    rating: 5,
    text: "The atmosphere was beautiful, and everything tasted fresh and authentic. Excellent service too.",
  },
  {
    id: 3,
    name: "Mohammed Al-Otaibi",
    image: buildCloudinaryUrl("https://randomuser.me/api/portraits/men/15.jpg"),
    rating: 5,
    text: "Generous portion sizes and great value for money. The grilled chicken was so juicy and well-marinated.",
  },
  {
    id: 4,
    name: "Sara Mahmoud",
    image: buildCloudinaryUrl("https://randomuser.me/api/portraits/women/63.jpg"),
    rating: 5,
    text: "Very clean restaurant with a cozy vibe. The desserts were delicious, and the presentation was lovely.",
  },
  {
    id: 5,
    name: "Khalid Al-Shami",
    image: buildCloudinaryUrl("https://randomuser.me/api/portraits/men/71.jpg"),
    rating: 5,
    text: "Amazing dining experience. The staff was very attentive, and the food was served hot and fresh.",
  },
  {
    id: 6,
    name: "Miyar Al-Hussein",
    image: buildCloudinaryUrl("https://randomuser.me/api/portraits/women/28.jpg"),
    rating: 5,
    text: "One of the best dining experiences I've had. Clean, welcoming atmosphere, and incredibly flavorful appetizers.",
  },
  {
    id: 7,
    name: "Tamer Al-Feki",
    image: buildCloudinaryUrl("https://randomuser.me/api/portraits/men/52.jpg"),
    rating: 5,
    text: "Great value for money. The food tasted fresh, and the staff was extremely friendly. Highly recommended!",
  },
  {
    id: 8,
    name: "Huda Al-Shareef",
    image: buildCloudinaryUrl("https://randomuser.me/api/portraits/women/17.jpg"),
    rating: 5,
    text: "Perfect place for family dinner. The service was outstanding, and every dish was absolutely delicious.",
  },
  {
    id: 9,
    name: "Yousef Al-Balushi",
    image: buildCloudinaryUrl("https://randomuser.me/api/portraits/men/88.jpg"),
    rating: 5,
    text: "Excellent food and prompt service. The presentation was top-notch, and the ingredients were extremely fresh.",
  },
  {
    id: 10,
    name: "Lina Zahran",
    image: buildCloudinaryUrl("https://randomuser.me/api/portraits/women/56.jpg"),
    rating: 5,
    text: "Absolutely loved the atmosphere! The seafood was fresh and delicious. I'll definitely come back.",
  },
];
