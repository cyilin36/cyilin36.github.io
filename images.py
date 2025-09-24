import os

def precise_replace():
    print("开始精确替换图片路径...")
    print(f"处理目录: {os.getcwd()}")
    print()
    
    file_count = 0
    total_replacements = 0
    
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    
                    # 精确替换：只替换 ![](images/ 为 ![](/images/
                    old_pattern = '![](images/'
                    new_pattern = '![](/images/'
                    
                    if old_pattern in content:
                        new_content = content.replace(old_pattern, new_pattern)
                        
                        if content != new_content:
                            # 计算替换次数
                            replacements = content.count(old_pattern) - new_content.count(old_pattern)
                            
                            # 直接保存，不备份
                            with open(file_path, 'w', encoding='utf-8') as f:
                                f.write(new_content)
                            
                            total_replacements += replacements
                            file_count += 1
                            print(f"✓ 已处理: {file} ({replacements} 次替换)")
                
                except Exception as e:
                    print(f"✗ 处理文件失败: {file} - {str(e)}")
    
    print()
    print("处理完成!")
    print(f"共处理了 {file_count} 个文件")
    print(f"总共进行了 {total_replacements} 次替换")
    
    if total_replacements == 0:
        print("\n提示: 没有进行任何替换，可能是因为:")
        print("1. 文件中没有找到 '![](images/' 这样的模式")
        print("2. 文件编码问题")
        print("3. 图片链接已经是指定格式")
    
    input("按回车键退出...")

if __name__ == "__main__":
    precise_replace()