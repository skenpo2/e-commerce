const mongoose = require('mongoose');
const slugify = require('slugify');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, 'Product name must be unique'],
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters long'],
      maxlength: [100, 'Product name must not exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
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
      enum: {
        values: ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Other'],
        message:
          'Category must be one of Electronics, Fashion, Home, Beauty, Sports, or Other',
      },
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

// Generate slug before saving
ProductSchema.pre('save', function (next) {
  if (this.isModified('name') && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Add indexes for optimized queries
ProductSchema.index({ name: 'text', category: 1, brand: 1 });

module.exports = mongoose.model('Product', ProductSchema);
