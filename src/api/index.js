//引入api文件夹下的api接口
// const requireAll = require.context('./modules/', false, /\.js$/)
// //requireAll.keys()为文件名数组; requireAll(apiName)获取文件暴露的内容
// const apiArr = requireAll.keys().map(apiName => requireAll(apiName).default || requireAll(apiName))
// //组合接口
// const apis = apiArr.reduce((prev, curr) => Object.assign(prev, curr), {})
// console.log('api', apis)
// export default apis
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./modules/', false, /\.js$/)
let apis = {}
requireAll(req).forEach(item => {
    // console.log('item1', item)
    apis = {
        ...apis,
        ...item
    }
})
// console.log('apis', apis)
export default apis
