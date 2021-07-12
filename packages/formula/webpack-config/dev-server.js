module.exports = {
    port: 3000,
    // contentBase:path.resolve(__dirname, '../build'),
    compress: true,
    open: true,
    hot: true,
    // 使用HTML5历史记录API时，index.html可能必须在该页面上代替任何404响应。
    historyApiFallback: true
};