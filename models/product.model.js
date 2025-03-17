const mongoose = require('mongoose');
const slugify = require('slugify');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters long'],
      maxlength: [100, 'Product name must not exceed 100 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['electronics', 'fashion', 'home', 'beauty', 'sports', 'other'],
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      minlength: [2, 'Brand name must be at least 2 characters long'],
      maxlength: [50, 'Brand name cannot exceed 50 characters'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    image: {
      url: {
        type: String,
        required: [true, 'Image URL is required'],
      },
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//  Generate slug before saving (for new products)
ProductSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

//  Update slug when the name is changed using `findOneAndUpdate`
ProductSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugify(update.name, { lower: true, strict: true });
    this.setUpdate(update);
  }
  next();
});

//  Indexing for search
ProductSchema.index({ name: 'text', category: 'text', brand: 'text' });

//  Indexing for filtering & sorting
ProductSchema.index({ category: 1, brand: 1, price: -1 });

// Enforcing uniqueness on name and slug
ProductSchema.index({ name: 1 }, { unique: true });
ProductSchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model('Product', ProductSchema);
