import fs from 'fs'
import path from 'path'

export const getBabelLoader = () => {
  const babelrc = fs.readFileSync(path.join(__dirname, '..', '.babelrc'), 'utf-8')

  try {
    const options = JSON.parse(babelrc)
  } catch (err) {
    console.error('==>     ERROR: Error parsing your .babelrc.')
    throw new Error(err)
  }

  return {
    loader: 'babel-loader',
    options
  }
}

export default {
  output: {
    path: path.join(__dirname, 'static'),
    filename: '[name].js',
    publicPath: path.join(__dirname, '..')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, '..', 'src')
        loader: getBabelLoader()
      },
      {
        test: /\.css$/,
        include: path.join(__dirname, '..', 'static', 'css'),
        loader: 'style-loader!css-loader'
      }
    ]
  }
}
