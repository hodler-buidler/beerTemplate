const gulp = require("gulp");
const browserSync = require("browser-sync");
const del = require("del");
const cache = require("gulp-cache");
const minifyHTML = require("gulp-htmlmin");
const sass = require("gulp-sass");
const cssnano = require("gulp-cssnano");
const autoprefixer = require("gulp-autoprefixer");
const minifyJS = require("gulp-minify");
const imagemin = require("gulp-imagemin");
const pngquant = require("imagemin-pngquant");

let paths = {
	html: {
		src: "app/**/*.html",
		dest: "dist"
	},
	css: {
		src: "app/css/**/*.css",
		dest: "dist/css"
	},
	CSSLibs: {
		src: "app/libs/css/*.css",
		dest: "dist/libs/css"
	},
	sass: {
		src: "app/sass/**/*.+(sass|scss)",
		dest: "dist/sass",
		compileDest: "app/css"
	},
	js: {
		src: "app/js/**/*.js",
		dest: "dist/js"
	},
	JSLibs: {
		src: "app/libs/js/*/dist/*.js",
		dest: "dist/libs/js"
	},
	fonts: {
		src: "app/fonts/**/*.+(ttf|woff|eot)",
		dest: "dist/fonts"
	},
	images: {
		src: "app/images/**/*.+(jpeg|jpg|png|svg|gif)",
		dest: "dist/images"
	},
	otherFiles: {
		src: ["app/*.ico"],
		dest: "dist"
	}
};

// Running server
function server() {
	browserSync({
		server: {
			baseDir: "app"
		},
		notify: false
	});
}

// Removing dist folder
function removeDist() {
	return del("dist");
}

// Clearing cache
function clearCache() {
	return cache.clearAll();
}

// Handling sass
function compileSass() {
	return gulp.src(paths.sass.src)
	.pipe(sass())
	.pipe(autoprefixer(["last 15 versions", "> 1%", "ie 8", "ie 7"], {cascade: true})) // add prefixes to css properties
	.pipe(gulp.dest(paths.sass.compileDest))
	.pipe(browserSync.reload({stream: true})); // reload page if sass files changed
}

// Load html files to dist folder and uglify them
function loadHTML() {
	return gulp.src(paths.html.src)
	.pipe(minifyHTML({collapseWhitespace: true}))
	.pipe(gulp.dest(paths.html.dest));
}

// Load css files to dist folder and uglify them
function loadCSS() {
	return gulp.src(paths.css.src)
	.pipe(cssnano())
	.pipe(gulp.dest(paths.css.dest));
}

// Load css libraries to dist folder
function loadCSSLibs() {
	return gulp.src(paths.CSSLibs.src)
	.pipe(gulp.dest(paths.CSSLibs.dest));
}

// Load sass to dist folder
function loadSASS() {
	return gulp.src(paths.sass.src)
	.pipe(gulp.dest(paths.sass.dest));
}

// Load js files to dist folder
function loadJS() {
	return gulp.src(paths.js.src)
	// .pipe(minifyJS()) uglify js
	.pipe(gulp.dest(paths.js.dest));
}

// Load js libraries to dist folder
function loadJSLibs() {
	return gulp.src(paths.JSLibs.src)
	.pipe(gulp.dest(paths.JSLibs.dest));
}

// Load fonts to dist folder
function loadFonts() {
	return gulp.src(paths.fonts.src)
	.pipe(gulp.dest(paths.fonts.dest));
}

// Load images to dist folder and handle them
function loadImages() {
	return gulp.src(paths.images.src)
	.pipe(cache(imagemin([
		pngquant(), // better handling PNG images
	    imagemin.gifsicle({interlaced: true}),
	    imagemin.jpegtran({progressive: true}),
	    imagemin.optipng({optimizationLevel: 5}),
	    imagemin.svgo({
	        plugins: [
	            {removeViewBox: true},
	            {cleanupIDs: false}
	        ]
	    })
	])))
	.pipe(gulp.dest(paths.images.dest));
}

function loadOtherFiles() {
	return gulp.src(paths.otherFiles.src)
	.pipe(gulp.dest(paths.otherFiles.dest));
}

// Reloading html if it changes
function reloadHTML() {
	return gulp.src(paths.html.src)
	.pipe(browserSync.reload({stream: true}));
}

// Reloading js if it changes
function reloadJS() {
	return gulp.src(paths.js.src)
	.pipe(browserSync.reload({stream: true}));
}

// Watching after changes in files
function watch() {
	gulp.watch(paths.sass.src, gulp.series(compileSass)); // sass
	gulp.watch(paths.html.src, gulp.series(reloadHTML)); // html
	gulp.watch(paths.js.src, gulp.series(reloadJS)); // js
}


// Initializing tasks
exports.server = server;
exports.removeDist = removeDist;
exports.clearCache = clearCache;
exports.compileSass = compileSass;
exports.loadHTML = loadHTML;
exports.loadCSS = loadCSS;
exports.loadCSSLibs = loadCSSLibs;
exports.loadSASS = loadSASS;
exports.loadJS = loadJS;
exports.loadJSLibs = loadJSLibs;
exports.loadFonts = loadFonts;
exports.loadImages = loadImages;
exports.loadOtherFiles = loadOtherFiles;
exports.reloadHTML = reloadHTML;
exports.reloadJS = reloadJS;
exports.watch = watch;

// General tasks which runs some other task and perform some result

// Load everyrhing to dist folder
let loadTask = gulp.parallel(
	loadHTML, 
	loadCSS,
	loadCSSLibs,
	loadSASS,
	loadJS,
	loadJSLibs,
	loadFonts,
	loadImages,
	loadOtherFiles
);
gulp.task("load", loadTask);

// Build final project
let buildTask = gulp.series(
	removeDist,
	compileSass,
	"load"
);
gulp.task("build", buildTask);

// Running server and starting watching changes
let defaultTask = gulp.series(
					gulp.parallel(compileSass, reloadHTML, reloadJS), 
					gulp.parallel(watch, server)
				);
gulp.task("default", defaultTask);