# 普通物理学

## 1. 质点运动学

### 1. 自然坐标系

1. 轨道上质点的位置用某一点开始(原点O)算起的曲线长度S来表征

$$
此时有v=\frac{ds}{dt}
$$

2.  切向加速度 与 法向加速度

<img src="img1.png"  style="zoom:50%;" />

1. 以圆代曲 （分析曲线运动的加速度）

用“以圆代曲”的思想，甚至可以导出机械能守恒定律/动能定理
     如在一般曲线上
$$
because\,\,a_t=\frac{dv}{dt}=-g\sin\theta \\
thus,\mathrm{d}v=-g\sin\theta\mathrm\,{d}t=-g\frac{dy}{ds}dt\\
\mathrm{d}v=\frac{gdy}{v}\\
\int_{v_0}^vvdv=-g\int_{y_0}^y \mathrm{d}y\\
v^2-v_0^2=2g(y_0-y)
$$

## 2. 相对运动

### 参考系变换

# 普通物理学笔记：非惯性参考系与牵连加速度

## 一、圆滚线运动分析
### 题目描述
质点沿圆滚线运动，轨迹方程为 \( S = 4 \cos \theta \)，其中：
- \( \theta \) 为圆滚线上某点切线与 \( x \) 轴的夹角，
- \( S \) 为点 \( P \) 到曲线最低点的弧长。

**需证明**：若角速度 \( \dot{\theta} \) 为常数，则切向速度 \( V \) 也为常数。

### 推导过程
1. **切向速度表达式**：
   \[
   V = \frac{dS}{dt} = \frac{d}{dt}(4 \cos \theta) = -4 \sin \theta \cdot \dot{\theta}
   \]
   （注：PDF中公式可能有误，此处为修正后推导）

2. **若 \( \dot{\theta} = \text{常数} \)**：
   - 当 \( \theta = 0 \)（最低点）时，\( V = -4 \cdot 0 \cdot \dot{\theta} = 0 \)；
   - 当 \( \theta = \pi/2 \) 时，\( V = -4 \cdot 1 \cdot \dot{\theta} = -4\dot{\theta} \)。

   显然速度随 \( \theta \) 变化，**原题结论存疑**。可能需检查题目条件或公式定义。

---

## 二、非惯性参考系中的力学修正
### 1. 惯性力
- **公式**：若参考系 \( K' \) 相对惯性系 \( K \) 有加速度 \( \boldsymbol{A} \)，则物体在 \( K' \) 中的运动需引入惯性力：
  \[
  \boldsymbol{F}_{\text{惯性}} = -m \boldsymbol{A}
  \]
- **牛顿定律修正**：
  \[
  \boldsymbol{F}_{\text{真实}} + \boldsymbol{F}_{\text{惯性}} = m \boldsymbol{a}_{\text{相对}}
  \]

### 2. 惯性离心力
- **公式**：在角速度为 \( \omega \) 的转动参考系中，离心力为：
  \[
  \boldsymbol{F}_{\text{离心}} = m \omega^2 \boldsymbol{r}
  \]
  方向背离转轴。
- **离心加速度**：
  \[
  \boldsymbol{a}_{\text{离心}} = \omega^2 \boldsymbol{r}
  \]

### 3. 科里奥利力
- **公式**：当物体在转动参考系中具有相对速度 \( \boldsymbol{v}_{\text{相对}} \) 时，科里奥利力为：
  \[
  \boldsymbol{F}_{\text{科里奥利}} = -2m (\boldsymbol{\omega} \times \boldsymbol{v}_{\text{相对}})
  \]

---

## 三、牵连加速度与虚拟力
### 1. 牵连加速度定义
牵连加速度是非惯性参考系因自身加速运动（平动或转动）产生的附加加速度，公式为：
\[
\boldsymbol{a}_{\text{牵连}} = \boldsymbol{a}_{\text{参考系}} + \boldsymbol{a}_{\text{离心}} + \boldsymbol{a}_{\text{科里奥利}}
\]

### 2. 应用示例
- **平动参考系**：若参考系以加速度 \( \boldsymbol{A} \) 平动，则牵连加速度为 \( -\boldsymbol{A} \)。
- **转动参考系**：牵连加速度包括离心加速度和科里奥利加速度。

---

## 四、关键公式总结
| 概念       | 公式                                                         |
| ---------- | ------------------------------------------------------------ |
| 切向速度   | \( V = \frac{dS}{dt} = -4 \sin \theta \cdot \dot{\theta} \)  |
| 惯性力     | \( \boldsymbol{F}_{\text{惯性}} = -m \boldsymbol{A} \)       |
| 离心力     | \( \boldsymbol{F}_{\text{离心}} = m \omega^2 \boldsymbol{r} \) |
| 科里奥利力 | \( \boldsymbol{F}_{\text{科}} = -2m (\boldsymbol{\omega} \times \boldsymbol{v}) \) |
| 牵连加速度 | \( \boldsymbol{a}_{\text{牵连}} = \boldsymbol{A} + \omega^2 \boldsymbol{r} + 2\boldsymbol{\omega} \times \boldsymbol{v} \) |

---

## 五、问题与思考
1. **圆滚线运动题目中切速度是否为常数？**  
   - 需重新核对题目条件或轨迹方程定义。

2. **如何区分牵连加速度与科里奥利加速度？**  
   - 牵连加速度包含参考系平动和离心效应，科里奥利加速度由相对运动引起。
